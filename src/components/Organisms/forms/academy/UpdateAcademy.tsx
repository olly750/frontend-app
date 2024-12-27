// import { Label } from "@headlessui/react/dist/components/label/label";

import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import { queryClient } from '../../../../plugins/react-query';
import academyStore from '../../../../store/administration/academy.store';
import { TranslationPresets } from '../../../../translations/i18n';
import { Link, ParamType, ValueType } from '../../../../types';
import {
  AcademyCreateInfo,
  AcademyInfoErrors,
  AcademyLocationErrors,
} from '../../../../types/services/academy.types';
import { usePicture } from '../../../../utils/file-util';
import {
  academyInfoSchema,
  academyLocationSchema,
} from '../../../../validations/academy.validation';
import Avatar from '../../../Atoms/custom/Avatar';
import Button from '../../../Atoms/custom/Button';
import FileUploader from '../../../Atoms/Input/FileUploader';
import Heading from '../../../Atoms/Text/Heading';
import ILabel from '../../../Atoms/Text/ILabel';
import BreadCrumb from '../../../Molecules/BreadCrumb';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import LocationMolecule from '../../../Molecules/input/LocationMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import Stepper from '../../../Molecules/Stepper/Stepper';

interface IProps {
  details: AcademyCreateInfo;
  display_label: string;
  handleChange: (_e: ValueType) => any;
  handleNext: <T>(_e: FormEvent<T>) => any;
  handleUpload: (_files: FileList | null) => void;
  logoId: string;
}

export default function UpdateAcademy() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { url } = useRouteMatch();

  const [currentStep, setCurrentStep] = useState(0);

  const [details, setDetails] = useState<AcademyCreateInfo>({
    current_admin_id: '',
    email: '',
    fax_number: '',
    full_address: '',
    head_office_location_id: 0,
    institution_id: '',
    mission: '',
    moto: '',
    name: '',
    phone_number: '',
    postal_code: '',
    short_name: '',
    website_link: '',
    translation_preset: '',
  });

  const [logoFile, setlogoFile] = useState<File | null>(null);
  const [logoId, setLogoId] = useState('');

  const { data: academyInfo } = academyStore.getAcademyById(id);
  const { mutateAsync } = academyStore.modifyAcademy();
  const { mutateAsync: mutateAddLogo } = academyStore.addLogo();

  useEffect(() => {
    academyInfo?.data.data &&
      setDetails({
        ...academyInfo?.data.data,
        institution_id: academyInfo?.data.data.institution.id + '',
      });

    setLogoId(academyInfo?.data.data.logo_attachment_id?.toString() || '');
  }, [academyInfo]);

  console.log(academyInfo?.data.data.logo_attachment_id?.toString() || '');

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  const handleUpload = (files: FileList | null) => {
    setlogoFile(files ? files[0] : null);
  };

  const list: Link[] = [
    { to: '', title: 'Institution admin' },
    { to: '/dashboard/academies', title: 'academies' },
    { to: `${url}`, title: 'edit academy' },
  ];

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (currentStep === 0) setCurrentStep(currentStep + 1);
    else {
      await mutateAsync(details, {
        onSuccess(data) {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['academies/instutionId']);
          addLogo(data.data.data.id);
          history.goBack();
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    }
  }

  async function addLogo(academyId: string) {
    if (logoFile) {
      let data = new FormData();

      data.append('description', `${details.name} s public logo`);
      data.append('purpose', 'Add a design identifier for academy');
      data.append('logoFile', logoFile);

      await mutateAddLogo(
        { id: academyId, info: data },
        {
          onSuccess(data) {
            toast.success(data.data.message);
          },
          onError(error: any) {
            toast.error(error.response.data.message);
          },
        },
      );
    }
  }

  return (
    <>
      <section>
        <BreadCrumb list={list} />
      </section>
      <Heading className="py-4" fontSize="2xl" fontWeight="semibold">
        Edit Academy
      </Heading>
      <div className="bg-main w-1/3 px-8 pt-8">
        <Stepper
          currentStep={currentStep}
          completeStep={currentStep}
          width="w-64"
          isVertical={false}
          isInline={false}
          navigateToStepHandler={() => {}}>
          <AcademyInfoComponent
            logoId={logoId}
            display_label=""
            details={details}
            handleChange={handleChange}
            handleNext={handleSubmit}
            handleUpload={handleUpload}
          />
          <AcademyLocationComponent
            logoId={logoId}
            display_label=""
            details={details}
            handleChange={handleChange}
            handleNext={handleSubmit}
            handleUpload={handleUpload}
          />
        </Stepper>
      </div>
    </>
  );
}

function AcademyInfoComponent({
  details,
  handleChange,
  handleNext,
  handleUpload,
  logoId,
}: IProps) {
  const initialErrorState: AcademyInfoErrors = {
    name: '',
    short_name: '',
    mission: '',
    moto: '',
    translation_preset: '',
  };

  const [errors, setErrors] = useState<AcademyInfoErrors>(initialErrorState);
  const { user } = useAuthenticator();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = academyInfoSchema.validate(details, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: AcademyInfoErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof AcademyInfoErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        required={false}
        error={errors.name}
        name="name"
        placeholder="Type academy name"
        value={details.name}
        handleChange={handleChange}>
        academy name
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.short_name}
        name="short_name"
        placeholder="Type short name"
        value={details.short_name}
        handleChange={handleChange}>
        academy short name
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.mission}
        name="mission"
        value={details.mission}
        handleChange={handleChange}>
        academy mission
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.moto}
        name="moto"
        value={details.moto}
        handleChange={handleChange}>
        academy motto
      </InputMolecule>
      <SelectMolecule
        error={errors.translation_preset}
        options={TranslationPresets.map((preset) => ({ label: preset, value: preset }))}
        name="translation_preset"
        value={details.translation_preset || 'default'}
        placeholder={'Language to the academy uses'}
        handleChange={handleChange}>
        Translation Language
      </SelectMolecule>
      <div>
        <div className="mb-3 flex items-center gap-6 py-4">
          <Avatar
            className="border-4 object-cover border-primary-500"
            size="80"
            src={usePicture(logoId, user?.id)}
            alt="photo"
          />
          <ILabel weight="bold">academy logo</ILabel>
        </div>
        <FileUploader
          allowPreview={false}
          handleUpload={handleUpload}
          accept={'image/jpeg, image/png'}>
          <Button styleType="outline" type="button">
            update logo
          </Button>
        </FileUploader>
      </div>

      <div className="pt-3">
        <Button type="submit">Save and continue</Button>
      </div>
    </form>
  );
}

function AcademyLocationComponent({ details, handleChange, handleNext }: IProps) {
  const initialErrorState: AcademyLocationErrors = {
    email: '',
    phone_number: '',
    fax_number: '',
    website_link: '',
    head_office_location_id: '',
    full_address: '',
  };

  const [errors, setErrors] = useState<AcademyLocationErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = academyLocationSchema.validate(details, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: AcademyLocationErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof AcademyLocationErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        required={false}
        error={errors.email}
        name="email"
        type="email"
        value={details.email}
        placeholder="example@gmail.com"
        handleChange={handleChange}>
        academy email
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.phone_number}
        name="phone_number"
        type="tel"
        value={details.phone_number}
        placeholder="Type academy phone number"
        handleChange={handleChange}>
        academy phone number
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.fax_number}
        name="fax_number"
        value={details.fax_number}
        handleChange={handleChange}>
        academy fax number
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.website_link}
        name="website_link"
        value={details.website_link}
        placeholder="Type website url"
        handleChange={handleChange}>
        academy website
      </InputMolecule>
      <LocationMolecule
        error={errors.head_office_location_id}
        placeholder="Select head office location"
        name="head_office_location_id"
        handleChange={handleChange}>
        Head office location
      </LocationMolecule>
      <InputMolecule
        required={false}
        error={errors.full_address}
        name="full_address"
        value={details.full_address}
        handleChange={handleChange}>
        academy physical address
      </InputMolecule>
      <div className="pt-3 flex justify-between w-60 md:w-80">
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
