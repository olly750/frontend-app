import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import Avatar from '../../components/Atoms/custom/Avatar';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import FileUploader from '../../components/Atoms/Input/FileUploader';
import Heading from '../../components/Atoms/Text/Heading';
import ILabel from '../../components/Atoms/Text/ILabel';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import LocationMolecule from '../../components/Molecules/input/LocationMolecule';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../components/Molecules/input/TextAreaMolecule';
import { institutionStore } from '../../store/administration/institution.store';
import { GenericStatus, ParamType, ValueType } from '../../types';
import {
  BasicInstitutionInfo,
  IInstitutionTheme,
} from '../../types/services/institution.types';
import { usePicture } from '../../utils/file-util';
import { getDropDownStatusOptions } from '../../utils/getOption';
import { institutionSchema } from '../../validations/academy.validation';

interface InstitutionError
  extends Pick<
    BasicInstitutionInfo,
    | 'name'
    | 'short_name'
    | 'email'
    | 'phone_number'
    | 'website_link'
    | 'moto'
    | 'mission'
    | 'fax_number'
    | 'full_address'
  > {}

export default function UpdateInstitution() {
  const { id } = useParams<ParamType>();
  const { data } = institutionStore.getInstitutionById(id);

  const [values, setValues] = useState<BasicInstitutionInfo>({
    current_admin_id: '',
    head_office_location_id: 17445,
    email: '',
    fax_number: '',
    full_address: '',
    generic_status: GenericStatus.ACTIVE,
    mission: '',
    moto: '',
    name: '',
    phone_number: '',
    postal_code: '',
    short_name: '',
    website_link: '',
    id: '',
    theme: IInstitutionTheme.DEFAULT,
  });

  const initialErrorState: InstitutionError = {
    name: '',
    short_name: '',
    email: '',
    phone_number: '',
    website_link: '',
    moto: '',
    mission: '',
    fax_number: '',
    full_address: '',
  };
  const [errors, setErrors] = useState(initialErrorState);

  const [logoFile, setlogoFile] = useState<File | null>(null);

  useEffect(() => {
    const institution = data?.data.data;

    institution &&
      setValues({
        current_admin_id: institution.current_admin_id,
        head_office_location_id: 17445,
        email: institution.email,
        fax_number: institution.fax_number || '',
        full_address: institution.full_address,
        generic_status: institution.generic_status,
        mission: institution.mission,
        moto: institution.moto,
        name: institution.name,
        phone_number: institution.phone_number,
        postal_code: institution.postal_code || 'x',
        short_name: institution.short_name,
        website_link: institution.website_link,
        id: id,
        theme: institution.theme,
      });
  }, [data, id]);

  const handleChange = (e: ValueType) => {
    setValues({ ...values, [e.name]: e.value });
  };

  const handleUpload = (files: FileList | null) => {
    setlogoFile(files ? files[0] : null);
  };

  const { mutateAsync, isLoading } = institutionStore.updateInstitution();
  const { mutateAsync: mutateAddLogo, isLoading: isAddingLogo } =
    institutionStore.addLogo();

  function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    const validatedForm = institutionSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        let toastId = toast.loading('Updating insitution');
        mutateAsync(values, {
          onSuccess(data) {
            toast.success(data.data.message, { duration: 1200, id: toastId });
            addLogo(data.data.data.id + '');
          },
          onError(error: any) {
            toast.error(error.response.data.message, { id: toastId });
          },
        });
      })
      .catch((err) => {
        const validatedErr: InstitutionError = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof InstitutionError] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  async function addLogo(institutionId: string) {
    if (logoFile) {
      let data = new FormData();

      data.append('description', `${values.name}'s public logo`);
      data.append('purpose', 'Add a design identifier for academy');
      data.append('logoFile', logoFile);

      await mutateAddLogo(
        { id: institutionId, info: data },
        {
          onSuccess(_data) {
            toast.success('Logo added successfully');
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred');
          },
        },
      );
    }
  }

  return (
    <div className="py-8 lg:py-8 px-8">
      <Heading color="primary" fontWeight="semibold" fontSize="3xl">
        Edit a new institution
      </Heading>
      <div className="pb-8"></div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <>
            <div className="py-2">
              <InputMolecule
                error={errors.name}
                required={false}
                name="name"
                value={values.name}
                placeholder="institution name"
                handleChange={(e) => handleChange(e)}>
                Institution name
              </InputMolecule>
            </div>
            <div className="py-2">
              <InputMolecule
                error={errors.short_name}
                required={false}
                name="short_name"
                value={values.short_name}
                placeholder="institution short name"
                handleChange={(e) => handleChange(e)}>
                Institution short name (abbreviations)
              </InputMolecule>
            </div>
            <div className="py-2">
              <InputMolecule
                error={errors.email}
                required={false}
                name="email"
                value={values.email}
                placeholder="email@example.com"
                handleChange={(e) => handleChange(e)}>
                Institution email
              </InputMolecule>
            </div>
            <div className="py-2">
              <InputMolecule
                error={errors.phone_number}
                required={false}
                name="phone_number"
                value={values.phone_number}
                placeholder="Phone number"
                handleChange={(e) => handleChange(e)}>
                Institution Phone number
              </InputMolecule>
            </div>
          </>
          <>
            <div className="py-2">
              <InputMolecule
                error={errors.website_link}
                name="website_link"
                required={false}
                value={values.website_link}
                placeholder="www.example.com"
                handleChange={(e) => handleChange(e)}>
                Institution website(optional)
              </InputMolecule>
            </div>
            <div className="py-2">
              <TextAreaMolecule
                error={errors.moto}
                required={false}
                name="moto"
                value={values.moto}
                placeholder="Motto"
                handleChange={(e) => handleChange(e)}>
                Institution motto
              </TextAreaMolecule>
            </div>
            <div className="py-2">
              <TextAreaMolecule
                error={errors.mission}
                required={false}
                name="mission"
                value={values.mission}
                placeholder="Mission"
                handleChange={(e) => handleChange(e)}>
                Institution mission
              </TextAreaMolecule>
            </div>
            <div className="py-2">
              <InputMolecule
                error={errors.fax_number}
                required={false}
                name="fax_number"
                value={values.fax_number}
                placeholder="Fax number"
                handleChange={(e) => handleChange(e)}>
                Fax Number
              </InputMolecule>
            </div>
            <div className="py-2">
              <LocationMolecule
                error={errors.full_address}
                name="full_address"
                value={values.full_address}
                handleChange={(e) => handleChange(e)}>
                Head Office Location
              </LocationMolecule>
            </div>

            <div className="py-2">
              <SelectMolecule
                handleChange={handleChange}
                name={'theme'}
                value={values.theme?.toString()}
                options={getDropDownStatusOptions(IInstitutionTheme)}>
                Select Theme
              </SelectMolecule>
            </div>
          </>
        </div>

        <div className="py-2 col-span-2">
          <div className="flex items-center gap-6 pb-4">
            <Avatar
              className="border-4 object-cover border-primary-500"
              size="80"
              src={usePicture(
                data?.data.data?.logo_attachment_id?.toString(),
                data?.data.data.id,
                '/images/rdf-logo.png',
                'logos',
              )}
              alt="photo"
            />
            <ILabel>Institution logo</ILabel>
          </div>

          <FileUploader
            allowPreview={false}
            handleUpload={handleUpload}
            accept={'image/jpeg, image/png'}>
            <Button type="button" styleType="outline">
              <span className="flex items-center">
                <Icon name="attach" useheightandpadding={false} fill="primary" />
                <span className="">Update logo</span>
              </span>
            </Button>
          </FileUploader>
        </div>
        <div className="py-4 col-span-2">
          <Button type="submit" isLoading={isLoading || isAddingLogo}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
