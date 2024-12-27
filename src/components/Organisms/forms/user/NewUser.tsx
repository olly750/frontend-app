import moment from 'moment';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import countryList from 'react-select-country-list';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import academyStore from '../../../../store/administration/academy.store';
import { intakeStore } from '../../../../store/administration/intake.store';
import programStore from '../../../../store/administration/program.store'; // getLevelsByAcademicProgram,
import usersStore from '../../../../store/administration/users.store';
import { CommonFormProps, RoleType, SelectData, ValueType } from '../../../../types';
// import { ProgramInfo } from '../../../../types/services/program.types';
import {
  CreateUserInfo,
  DocType,
  EducationLevel,
  GenderStatus,
  MaritalStatus,
  ProfileStatus,
  SendCommunicationMsg,
  UserType,
} from '../../../../types/services/user.types';
import {
  getDropDownOptions,
  getDropDownStatusOptions,
} from '../../../../utils/getOption';
import { validation } from '../../../../utils/validations';
import { newUserSchema } from '../../../../validations/user.validation';
import Button from '../../../Atoms/custom/Button';
import PasswordField from '../../../Atoms/Input/PasswordInput';
import Heading from '../../../Atoms/Text/Heading';
import DateMolecule from '../../../Molecules/input/DateMolecule';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
// import SelectMolecule from '../../../Molecules/input/SelectMolecule';

interface IParams {
  userType: UserType;
}

export interface NewUserErrors
  extends Pick<
    CreateUserInfo,
    | 'spouse_name'
    | 'academy_id'
    | 'birth_date'
    | 'email'
    | 'first_name'
    | 'intake_program_id'
    | 'last_name'
    | 'mother_names'
    | 'father_names'
    | 'nid'
    | 'password'
    | 'phone'
    | 'username'
    | 'nationality'
    | 'document_expire_on'
  > {
  is_student: boolean;
  has_spouse: boolean;
  has_academy: boolean;
  has_passport: boolean;
}

export default function NewUser<E>({ onSubmit }: CommonFormProps<E>) {
  const history = useHistory();
  const { t } = useTranslation();

  // const newUserType = pick(UserType, ['ADMIN', 'INSTRUCTOR', 'STUDENT']);
  // const newUserTypeWithSuper = { ...newUserType, SUPER_ADMIN: 'SUPER_ADMIN' };
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();

  let { userType } = useParams<IParams>();

  const [details, setDetails] = useState<CreateUserInfo>({
    activation_key: '',
    spouse_name: '',
    academy_id: '',
    deployed_on: '',
    deployment_number: `DEP-${parseInt(Math.random() * 10000 + '')}`,
    birth_date: '',
    doc_type: DocType.NID,
    education_level: EducationLevel.SECONDARY,
    email: '',
    father_names: '',
    first_name: '',
    // academic_program_level_id: '',
    intake_program_id: '',
    last_name: '',
    marital_status: MaritalStatus.SINGLE,
    mother_names: '',
    nid: '',
    institution_id: '',
    password: '',
    password_reset_period_in_days: 0,
    person_id: '',
    phone: '',
    place_of_birth: '',
    place_of_residence: '',
    reset_date: '',
    residence_location_id: null,
    sex: GenderStatus.MALE,
    user_type: userType,
    username: '',
    nationality: '',
    document_expire_on: '',
    send_communication_msg: SendCommunicationMsg.BOTH,
    profile_status: ProfileStatus.INCOMPLETE,
    id: '',
  });

  const initialErrorState: NewUserErrors = {
    spouse_name: '',
    academy_id: '',
    birth_date: '',
    email: '',
    first_name: '',
    intake_program_id: '',
    last_name: '',
    mother_names: '',
    father_names: '',
    nid: '',
    password: '',
    phone: '',
    username: '',
    nationality: '',
    document_expire_on: '',
    is_student: false,
    has_spouse: false,
    has_academy: false,
    has_passport: false,
  };

  const [errors, setErrors] = useState<NewUserErrors>(initialErrorState);

  const [otherDetail, setOtherDetail] = useState({
    intake: '',
    program: '',
  });

  const options = useMemo(() => countryList().getData(), []);
  useEffect(() => {
    setDetails((details) => ({
      ...details,
      intake_program_id: otherDetail.intake,
    }));
  }, [otherDetail.intake]);

  useEffect(() => {
    setDetails((details) => ({
      ...details,
      institution_id: user?.institution?.id.toString() || '',
      academy_id:
        picked_role?.type !== RoleType.INSTITUTION ? picked_role?.academy_id || '' : '',
    }));
  }, [picked_role?.academy_id, picked_role?.type, user?.institution?.id]);

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  function otherhandleChange(e: ValueType) {
    setOtherDetail((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  const { mutateAsync, isLoading } = usersStore.createUser();
  function addUser<T>(e: FormEvent<T>) {
    e.preventDefault();
    const cloneDetails = { ...details };
    Object.assign(cloneDetails, {
      is_student: details.user_type === UserType.STUDENT,
      has_spouse:
        details.marital_status === MaritalStatus.MARRIED ||
        details.marital_status === MaritalStatus.WIDOWED,
      has_academy: details.user_type !== UserType.SUPER_ADMIN,
      has_passport: details.doc_type == DocType.PASSPORT,
    });

    const validatedForm = newUserSchema.validate(cloneDetails, {
      abortEarly: false,
    });

    validatedForm
      .then(async () => {
        if (
          details.doc_type === DocType.NID &&
          validation.nidRwandaValidation(details.nid) !== ''
        ) {
          setErrors({
            ...errors,
            nid: validation.nidRwandaValidation(details.nid),
          });
        } else {
          let toastId = toast.loading(`Saving new ${userType.toLowerCase()}`);

          await mutateAsync(details, {
            onSuccess(theUser) {
              toast.success(theUser.data.message, { id: toastId });
              queryClient.invalidateQueries([
                'users',
                'users/academy',
                'users/academy/type',
              ]);
              history.push(`/dashboard/users/${theUser.data.data.id}/assign-role`);
            },
            onError(error: any) {
              toast.error(error.response.data.message, { id: toastId });
            },
          });
          if (onSubmit) onSubmit(e);
        }
      })
      .catch((err) => {
        const validatedErr: NewUserErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          //@ts-ignore
          validatedErr[el.path as keyof NewUserErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  // get all academies in an institution
  const academies = academyStore.fetchAcademies();

  const programs = programStore.getProgramsByAcademy(details.academy_id) || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const intakes = intakeStore.getIntakesByProgram(otherDetail.program) || [];
  return (
    <div className="p-6 w-5/12 pl-6 gap-3 rounded-lg bg-main mt-8">
      <div className="py-5 mb-3 capitalize">
        <Heading color="txt-primary" fontWeight="bold">
          New {userType.toLowerCase()}
        </Heading>
      </div>
      <form onSubmit={addUser}>
        {details.user_type === UserType.INSTRUCTOR ? (
          <>
            <DateMolecule
              defaultValue={moment().toString()}
              handleChange={handleChange}
              startYear={moment().year() - 20}
              endYear={moment().year()}
              reverse={false}
              name="deployed_on"
              width="60 md:w-80">
              Deployment date
            </DateMolecule>
            <InputMolecule
              readOnly
              name="deployment_number"
              placeholder="eg: Manzi"
              value={details.deployment_number}
              handleChange={handleChange}>
              Service number
            </InputMolecule>
          </>
        ) : null}
        <InputMolecule
          required={false}
          error={errors.first_name}
          name="first_name"
          placeholder="eg: Manzi"
          value={details.first_name}
          handleChange={handleChange}>
          First name
        </InputMolecule>
        <InputMolecule
          required={false}
          error={errors.last_name}
          name="last_name"
          placeholder="eg: Claude"
          value={details.last_name}
          handleChange={handleChange}>
          Last name
        </InputMolecule>
        <InputMolecule
          required={false}
          error={errors.email}
          name="email"
          placeholder="Enter email"
          value={details.email}
          handleChange={handleChange}>
          Email
        </InputMolecule>
        <InputMolecule
          required={false}
          error={errors.username}
          name="username"
          placeholder="Enter username"
          value={details.username}
          handleChange={handleChange}>
          Username
        </InputMolecule>
        <PasswordField
          required={false}
          error={errors.password}
          type="password"
          name="password"
          placeholder="Enter password"
          value={details.password}
          handleChange={handleChange}>
          Password
        </PasswordField>
        <DateMolecule
          error={errors.birth_date}
          startYear={moment().year() - 100}
          defaultValue={(moment().year() - 16).toString()}
          endYear={moment().year() - 16}
          handleChange={handleChange}
          name="birth_date"
          width="60 md:w-80"
          date_time_type={false}>
          Date of Birth
        </DateMolecule>
        <InputMolecule
          required={false}
          error={errors.phone}
          name="phone"
          placeholder="Enter phone number"
          value={details.phone}
          handleChange={handleChange}>
          Phone number
        </InputMolecule>
        <RadioMolecule
          className="pb-2"
          defaultValue={details.sex}
          options={getDropDownStatusOptions(GenderStatus)}
          value={details.sex}
          handleChange={handleChange}
          name="sex">
          Gender
        </RadioMolecule>
        <DropdownMolecule
          error={errors.nationality}
          width="60 md:w-80"
          name="nationality"
          defaultValue={options.find(
            (national) => national.value === details.nationality,
          )}
          handleChange={handleChange}
          options={options}>
          Nationality
        </DropdownMolecule>
        <DropdownMolecule
          placeholder={'Select your reference'}
          handleChange={handleChange}
          name="doc_type"
          defaultValue={getDropDownStatusOptions(DocType).find(
            (doc) => doc.value === details.doc_type,
          )}
          options={getDropDownStatusOptions(DocType)}>
          Reference Number
        </DropdownMolecule>
        <InputMolecule
          error={errors.nid}
          required={false}
          name="nid"
          type="text"
          value={details.nid}
          placeholder={`Enter ${details.doc_type.replaceAll('_', ' ')} number`}
          handleChange={handleChange}>
          {details.doc_type.replaceAll('_', ' ')}
        </InputMolecule>
        {details.doc_type == DocType.PASSPORT && (
          <DateMolecule
            error={errors.document_expire_on}
            startYear={moment().year() - 7}
            defaultValue={moment().toString()}
            endYear={moment().year() + 7}
            handleChange={handleChange}
            name="document_expire_on"
            width="60 md:w-80">
            Passport expiry date
          </DateMolecule>
        )}
        <DropdownMolecule
          defaultValue={getDropDownStatusOptions(MaritalStatus).find(
            (marital_status) => marital_status.value === details.marital_status,
          )}
          options={getDropDownStatusOptions(MaritalStatus)}
          name="marital_status"
          placeholder={'Select your marital status'}
          handleChange={handleChange}>
          Marital Status
        </DropdownMolecule>
        {(details.marital_status === MaritalStatus.MARRIED ||
          details.marital_status === MaritalStatus.WIDOWED) && (
          <InputMolecule
            error={errors.spouse_name}
            required={false}
            name="spouse_name"
            value={details.spouse_name}
            handleChange={handleChange}>
            Spouse Name
          </InputMolecule>
        )}
        <DropdownMolecule
          defaultValue={getDropDownStatusOptions(EducationLevel).find(
            (level) => level.value === details.education_level,
          )}
          options={getDropDownStatusOptions(EducationLevel)}
          name="education_level"
          placeholder={'Select your education level'}
          handleChange={handleChange}>
          Education level
        </DropdownMolecule>
        {picked_role?.type === RoleType.INSTITUTION &&
          details.user_type !== UserType.SUPER_ADMIN && (
            <DropdownMolecule
              error={errors.academy_id}
              options={getDropDownOptions({ inputs: academies.data?.data.data || [] })}
              name="academy_id"
              placeholder={
                academies.isLoading ? 'Loading academies...' : 'Academy to be enrolled in'
              }
              handleChange={handleChange}>
              Academy
            </DropdownMolecule>
          )}
        {details.user_type === UserType.STUDENT && (
          <>
            <DropdownMolecule
              error={errors.intake_program_id}
              options={
                programs.data?.data.data?.map((p) => ({
                  value: p.id,
                  label: p.name,
                })) as SelectData[]
              }
              name="program"
              placeholder={
                programs.isLoading
                  ? 'Loading programs...'
                  : t('Program') + ' to be enrolled in'
              }
              handleChange={otherhandleChange}>
              {t('Program')}
            </DropdownMolecule>
            <DropdownMolecule
              error={errors.intake_program_id}
              options={
                intakes.data?.data.data?.map((intk) => ({
                  value: intk.id,
                  label: intk.intake.title,
                })) as SelectData[]
              }
              name="intake"
              placeholder={
                intakes.isLoading ? 'Loading intakes...' : 'intake to be enrolled in'
              }
              handleChange={otherhandleChange}>
              Intake
            </DropdownMolecule>
            {/* <DropdownMolecule
              options={getDropDownOptions({
                inputs: levels.data?.data.data || [],
                labelName: ['name'], //@ts-ignore
                getOptionLabel: (level) => level.level && level.level.name,
              })}
              name="academic_program_level_id"
              placeholder={'Program to be enrolled in'}
              handleChange={handleChange}>
              Levels
            </DropdownMolecule> */}
          </>
        )}
        <Button type="submit" disabled={isLoading}>
          Create
        </Button>
      </form>
    </div>
  );
}
