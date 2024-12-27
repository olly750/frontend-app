import moment from 'moment';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import countryList from 'react-select-country-list';

import { CommonFormProps, CommonStepProps, ValueType } from '../../../../../../types';
import {
  BloodGroup,
  DocType,
  EducationLevel,
  GenderStatus,
  MaritalStatus,
  PersonDetail,
  UserInfo,
} from '../../../../../../types/services/user.types';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../../../../../utils/getLocalStorageItem';
import { getDropDownStatusOptions } from '../../../../../../utils/getOption';
import { personalDetailsSchema } from '../../../../../../validations/complete-profile/complete-profile.validation';
import Button from '../../../../../Atoms/custom/Button';
import Heading from '../../../../../Atoms/Text/Heading';
import DateMolecule from '../../../../../Molecules/input/DateMolecule';
import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import LocationMolecule from '../../../../../Molecules/input/LocationMolecule';
import SelectMolecule from '../../../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../../../Molecules/input/TextAreaMolecule';

interface Personal<E> extends CommonStepProps, CommonFormProps<E> {
  user?: UserInfo;
}

interface PersonalDetailErrors
  extends Pick<
    PersonDetail,
    | 'first_name'
    | 'last_name'
    | 'place_of_birth'
    | 'place_of_birth_description'
    | 'religion'
    | 'father_names'
    | 'mother_names'
    | 'place_of_residence'
    // | 'nationality'
    | 'spouse_name'
    | 'nid'
  > {
  document_expire_on: string;
  blood_group: string;
  // residence_location_id: string;
  has_passport: boolean;
}

export default function UpdatePersonalDetails<E>({
  display_label,
  isVertical,
  nextStep,
  user,
}: Personal<E>) {
  const [personalDetails, setPersonalDetails] = useState<PersonDetail>({
    nid: '',
    first_name: '',
    last_name: '',
    // email: '',
    sex: GenderStatus.MALE,
    place_of_birth: '',
    place_of_birth_id: '',
    place_of_birth_description: '',
    birth_date: '',
    religion: '',
    blood_group: BloodGroup['A+'],
    father_names: '',
    mother_names: '',
    marital_status: MaritalStatus.SINGLE,
    education_level: EducationLevel.SECONDARY,
    spouse_name: '',
    residence_location_id: null,
    place_of_residence: '',
    doc_type: DocType.NID,
    document_expire_on: '',
    nationality: '',
  });

  const initialErrorState: PersonalDetailErrors = {
    first_name: '',
    last_name: '',
    place_of_birth: '',
    place_of_birth_description: '',
    religion: '',
    blood_group: '',
    father_names: '',
    mother_names: '',
    // residence_location_id: '',
    place_of_residence: '',
    // nationality: '',
    spouse_name: '',
    nid: '',
    document_expire_on: '',
    has_passport: false,
  };

  const [errors, setErrors] = useState<PersonalDetailErrors>(initialErrorState);

  const [nationality, setnationality] = useState({
    birth: '',
    residence: '',
  });
  const nationhandleChange = (e: ValueType) => {
    setnationality({ ...nationality, [e.name]: e.value });
  };

  const handleChange = (e: ValueType) => {
    setPersonalDetails({ ...personalDetails, [e.name]: e.value });
  };

  const options = useMemo(
    () =>
      countryList()
        .getData()
        .map((country) => {
          return {
            value: country.label,
            label: country.label,
          };
        }),
    [],
  );

  useEffect(() => {
    setnationality({
      ...nationality,
      residence: user?.person?.place_of_residence || '',
      birth: user?.person?.place_of_birth || '',
    });
  }, [user?.person?.place_of_residence, user?.person?.place_of_birth]);

  useEffect(() => {
    setPersonalDetails({ ...personalDetails, place_of_birth: nationality.birth });
  }, [nationality.birth]);

  useEffect(() => {
    setPersonalDetails({ ...personalDetails, place_of_residence: nationality.residence });
  }, [nationality.residence]);

  const moveForward = (e: FormEvent) => {
    e.preventDefault();
    let data: any = getLocalStorageData('user');
    let newObj = Object.assign({}, data, {
      ...personalDetails,
      has_passport: personalDetails.doc_type == DocType.PASSPORT,
    });

    Object.keys(newObj).map((val) => {
      if (newObj[val] == null || newObj[val] == undefined) newObj[val] = '';
    });

    const validatedForm = personalDetailsSchema.validate(newObj, {
      abortEarly: false,
    });

    //change the rank id
    newObj.current_rank_id = newObj.current_rank_id
      ? newObj.current_rank_id
      : newObj.current_rank?.id;

    validatedForm
      .then(() => {
        delete newObj.person;
        delete newObj.academy;
        delete newObj.has_passport;
        setLocalStorageData('user', newObj);
        nextStep(true);
      })
      .catch((err) => {
        const validatedErr: PersonalDetailErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          //@ts-ignore
          validatedErr[el.path as keyof PersonalDetailErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  const [userInfo] = useState<UserInfo>(getLocalStorageData('user'));

  //when information change from the backend
  useEffect(() => {
    let personInfo = user?.person;
    personInfo &&
      setPersonalDetails((old) => {
        return { ...old, ...personInfo };
      });
  }, [user?.person]);

  //when user comes back to this step
  useEffect(() => {
    setPersonalDetails((old) => {
      {
        return { ...old, ...userInfo };
      }
    });
  }, [userInfo]);

  return (
    <div className={`flex flex-col gap-4 ${!isVertical && 'pt-8'}`}>
      {!isVertical && <Heading fontWeight="semibold">{display_label}</Heading>}
      <form onSubmit={moveForward}>
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          <div>
            <InputMolecule
              required={false}
              error={errors.first_name}
              name="first_name"
              placeholder="Your First Name"
              value={personalDetails.first_name}
              handleChange={handleChange}>
              First name
            </InputMolecule>
            <InputMolecule
              required={false}
              error={errors.last_name}
              name="last_name"
              placeholder="Your Last Name"
              value={personalDetails.last_name}
              handleChange={handleChange}>
              Last name
            </InputMolecule>
            <InputMolecule
              required={false}
              error={errors.father_names}
              name="father_names"
              placeholder="eg: John"
              value={personalDetails.father_names}
              handleChange={handleChange}>
              Father&apos;s names
            </InputMolecule>
            <InputMolecule
              required={false}
              error={errors.mother_names}
              name="mother_names"
              placeholder="eg: Doe"
              value={personalDetails.mother_names}
              handleChange={handleChange}>
              Mother&apos;s names
            </InputMolecule>
            <SelectMolecule
              placeholder={'Select your reference'}
              handleChange={handleChange}
              name="doc_type"
              value={personalDetails.doc_type}
              options={getDropDownStatusOptions(DocType)}>
              Reference Number
            </SelectMolecule>
            <InputMolecule
              error={errors.nid}
              required={false}
              name="nid"
              type="text"
              value={personalDetails.nid}
              placeholder={`Enter ${personalDetails.doc_type.replaceAll(
                '_',
                ' ',
              )} number`}
              handleChange={handleChange}>
              {personalDetails.doc_type.replaceAll('_', ' ')}
            </InputMolecule>
            {personalDetails.doc_type == DocType.PASSPORT && (
              <DateMolecule
                error={errors.document_expire_on}
                startYear={moment().year() - 7}
                defaultValue={
                  //@ts-ignore
                  userInfo.document_expire_on ||
                  userInfo.person?.document_expire_on ||
                  user?.person?.document_expire_on
                }
                endYear={moment().year() + 7}
                handleChange={handleChange}
                name="document_expire_on"
                width="60 md:w-80">
                Passport expiry date
              </DateMolecule>
            )}
            <SelectMolecule
              value={personalDetails.marital_status}
              options={getDropDownStatusOptions(MaritalStatus)}
              name="marital_status"
              placeholder={'Select your marital status'}
              handleChange={handleChange}>
              Marital Status
            </SelectMolecule>
            {(personalDetails.marital_status === MaritalStatus.MARRIED ||
              personalDetails.marital_status === MaritalStatus.WIDOWED) && (
              <InputMolecule
                error={errors.spouse_name}
                name="spouse_name"
                required={false}
                value={personalDetails.spouse_name}
                handleChange={handleChange}>
                Spouse Name
              </InputMolecule>
            )}
          </div>
          <div>
            <SelectMolecule
              error={errors.blood_group}
              hasError={errors.blood_group !== ''}
              placeholder="Select your blood type"
              name="blood_group"
              value={personalDetails.blood_group}
              handleChange={handleChange}
              options={getDropDownStatusOptions(BloodGroup)}>
              Blood group
            </SelectMolecule>
            <SelectMolecule
              placeholder={'Select your education level'}
              handleChange={handleChange}
              name="education_level"
              value={personalDetails.education_level}
              options={getDropDownStatusOptions(EducationLevel)}>
              Education level
            </SelectMolecule>
            {/* <InputMolecule
              required={false}
              error={errors.religion}
              name="religion"
              value={personalDetails.religion}
              placeholder="eg: Catholic"
              handleChange={handleChange}>
              Religion
            </InputMolecule> */}
            <DateMolecule
              startYear={moment().year() - 100}
              defaultValue={
                //@ts-ignore
                userInfo.birth_date ||
                userInfo.person?.birth_date ||
                user?.person?.birth_date
              }
              endYear={moment().year() - 16}
              handleChange={handleChange}
              name="birth_date"
              width="60 md:w-80"
              date_time_type={false}>
              Date of Birth
            </DateMolecule>
            <SelectMolecule
              error={errors.place_of_birth}
              hasError={errors.place_of_birth !== ''}
              width="60 md:w-80"
              name="birth"
              placeholder="Select the Nation"
              value={nationality.birth}
              handleChange={nationhandleChange}
              options={options}>
              Place of birth
            </SelectMolecule>
            {nationality.birth == 'Rwanda' && (
              <LocationMolecule
                placeholder="Select the exact location"
                name="place_of_birth_id"
                handleChange={handleChange}
                isRequired={!personalDetails.place_of_birth_id}
                villageId={personalDetails.place_of_birth_id?.toString() || ''}
              />
            )}
            <TextAreaMolecule
              error={errors.place_of_birth_description}
              width="72 md:w-80"
              name="place_of_birth_description"
              value={personalDetails.place_of_birth_description}
              handleChange={handleChange}>
              Place of birth description (optional)
            </TextAreaMolecule>
            <SelectMolecule
              error={errors.place_of_residence}
              hasError={errors.place_of_residence !== ''}
              width="60 md:w-80"
              name="residence"
              placeholder="Select the Nation"
              value={nationality.residence}
              handleChange={nationhandleChange}
              options={options}>
              Residence address
            </SelectMolecule>
            {nationality.residence == 'Rwanda' && (
              <LocationMolecule
                placeholder="Select the exact location"
                name="residence_location_id"
                handleChange={handleChange}
                isRequired={!personalDetails.residence_location_id}
                villageId={personalDetails.residence_location_id?.toString() || ''}
              />
            )}
            {/* <TextAreaMolecule
              error={errors.place_of_residence}
              width="72 md:w-80"
              name="place_of_residence"
              value={personalDetails.place_of_residence}
              handleChange={handleChange}>
              Residence Address description (optional)
            </TextAreaMolecule> */}
          </div>
        </div>
        <div className="flex justify w-4/5">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </div>
  );
}
