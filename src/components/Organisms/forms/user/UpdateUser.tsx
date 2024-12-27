import { pick } from 'lodash';
import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
// import academyStore from '../../../../store/administration/academy.store';
// import {
//   getIntakesByAcademy,
//   getProgramsByIntake,
// } from '../../../../store/administration/intake.store';
// import { getLevelsByAcademicProgram } from '../../../../store/administration/program.store';
import usersStore from '../../../../store/administration/users.store';
import { CommonFormProps, ParamType, RoleType, ValueType } from '../../../../types';
// import { AcademyInfo } from '../../../../types/services/academy.types';
// import { IntakeProgramInfo } from '../../../../types/services/intake-program.types';
import {
  DocType,
  EditUser,
  EducationLevel,
  GenderStatus,
  MaritalStatus,
  ProfileStatus,
  SendCommunicationMsg,
  UserType,
} from '../../../../types/services/user.types';
import {
  // getDropDownOptions,
  getDropDownStatusOptions,
} from '../../../../utils/getOption';
import { validation } from '../../../../utils/validations';
import { editUserSchema } from '../../../../validations/user.validation';
import Button from '../../../Atoms/custom/Button';
import Heading from '../../../Atoms/Text/Heading';
import DateMolecule from '../../../Molecules/input/DateMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

export interface EditUserErrors
  extends Pick<
    EditUser,
    | 'spouse_name'
    | 'academy_id'
    | 'birth_date'
    | 'email'
    | 'first_name'
    | 'intake_program_id'
    | 'last_name'
    | 'mother_names'
    | 'nid'
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

export default function UpdateUser<E>({ onSubmit }: CommonFormProps<E>) {
  const history = useHistory();
  const updateUserType = pick(UserType, ['ADMIN', 'INSTRUCTOR', 'STUDENT']);
  const updateUserTypeWithSuper = { ...updateUserType, SUPER_ADMIN: 'SUPER_ADMIN' };

  const picked_role = usePickedRole();

  const initialErrorState: EditUserErrors = {
    spouse_name: '',
    academy_id: '',
    birth_date: '',
    email: '',
    first_name: '',
    intake_program_id: '',
    last_name: '',
    mother_names: '',
    nid: '',
    phone: '',
    username: '',
    nationality: '',
    document_expire_on: '',
    is_student: false,
    has_spouse: false,
    has_academy: false,
    has_passport: false,
  };

  const [errors, setErrors] = useState<EditUserErrors>(initialErrorState);

  const [details, setDetails] = useState<EditUser>({
    activation_key: '',
    academy_id: '',
    birth_date: '',
    deployed_on: '',
    // deployment_number: '',
    doc_type: DocType.NID,
    education_level: EducationLevel.SECONDARY,
    email: '',
    father_names: '',
    first_name: '',
    institution_id: '',
    // academic_program_level_id: '',
    intake_program_id: '',
    last_name: '',
    marital_status: MaritalStatus.SINGLE,
    mother_names: '',
    nid: '',
    password_reset_period_in_days: 0,
    person_id: '',
    phone: '',
    place_of_birth: '',
    place_of_residence: '',
    residence_location_id: 0,
    reset_date: '',
    sex: GenderStatus.MALE,
    user_type: UserType.STUDENT,
    username: '',
    nationality: '',
    document_expire_on: '',
    send_communication_msg: SendCommunicationMsg.BOTH,
    profile_status: ProfileStatus.INCOMPLETE,
    id: '',
    spouse_name: '',
  });

  const { id } = useParams<ParamType>();
  const { data } = usersStore.getUserById(id);

  useEffect(() => {
    const selectedUser = data?.data.data;

    selectedUser &&
      setDetails({
        activation_key: '',
        academy_id: selectedUser.academy?.id,
        birth_date: selectedUser.person?.birth_date || '',
        deployed_on: '',
        // deployment_number: '',
        doc_type: selectedUser.person?.doc_type || DocType.NID,
        education_level: selectedUser.person?.education_level || EducationLevel.SECONDARY,
        email: selectedUser.email,
        father_names: selectedUser.person?.father_names || '',
        first_name: selectedUser.first_name,
        // academic_program_level_id: '',
        intake_program_id: '',
        last_name: selectedUser.last_name,
        marital_status: selectedUser.person?.marital_status || MaritalStatus.SINGLE,
        mother_names: selectedUser.person?.mother_names || '',
        nid: selectedUser.person?.nid || '',
        password_reset_period_in_days: selectedUser.password_reset_period_in_days,
        person_id: selectedUser.person?.id + '',
        phone: selectedUser.person?.phone_number || '',
        place_of_birth: selectedUser.person?.place_of_birth || '',
        place_of_residence: '',
        institution_id: selectedUser.institution?.id.toString() || '',
        residence_location_id: selectedUser.person?.residence_location_id || 0,
        reset_date: selectedUser.reset_date,
        sex: selectedUser.person?.sex || GenderStatus.MALE,
        user_type: selectedUser.user_type,
        username: selectedUser.username,
        nationality: selectedUser.person?.nationality || '',
        document_expire_on: selectedUser.person?.document_expire_on || '',
        send_communication_msg: selectedUser.send_communication_msg,
        profile_status: selectedUser.profile_status || ProfileStatus.INCOMPLETE,
        id: selectedUser.id + '',
        spouse_name: selectedUser.person?.spouse_name || '',
      });
  }, [data]);

  // const [otherDetails, setOtherDetails] = useState({
  //   intake: '',
  //   level: '',
  // });

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  // function otherhandleChange(e: ValueType) {
  //   setOtherDetails((details) => ({
  //     ...details,
  //     [e.name]: e.value,
  //   }));
  // }

  const { mutateAsync } = usersStore.modifyUser();
  async function addUser<T>(e: FormEvent<T>) {
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

    const validatedForm = editUserSchema.validate(cloneDetails, {
      abortEarly: false,
    });
    console.log(errors);

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
          Object.keys(details).map((val) => {
            //@ts-ignore
            if (!details[val]) details[val] = '';
          });

          await mutateAsync(details, {
            onSuccess(data) {
              toast.success(data.data.message);
              history.goBack();
            },
            onError(error: any) {
              toast.error(error.response.data.message);
            },
          });
          if (onSubmit) onSubmit(e);
        }
      })
      .catch((err) => {
        const validatedErr: EditUserErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          //@ts-ignore
          validatedErr[el.path as keyof EditUserErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }
  // get all academies in an institution
  // const academies: AcademyInfo[] | undefined =
  //   academyStore.fetchAcademies().data?.data.data;

  // get intakes based on selected academy
  // let intakes = getIntakesByAcademy(details.academy_id, false, !!details.academy_id);

  // useEffect(() => {
  //   intakes.refetch();
  // }, [details.academy_id, intakes]);

  // get programs based on selected intake
  // let programs = getProgramsByIntake(otherDetails.intake, !!otherDetails.intake);
  // useEffect(() => {
  //   programs.refetch();
  // }, [otherDetails.intake, programs]);

  //get levels based on selected program
  // let selectedProgram = programs.data?.data.data.find(
  //   (p) => p.id == details.intake_program_id,
  // );
  // let programId = selectedProgram?.program.id + '';
  // let levels = getLevelsByAcademicProgram(programId);

  // useEffect(() => {
  //   levels.refetch();
  // }, [details.intake_program_id, levels]);

  return (
    <div className="p-6 w-5/12 pl-6 gap-3 rounded-lg bg-main mt-8">
      <div className="py-5 mb-3 capitalize">
        <Heading color="txt-primary" fontWeight="bold">
          Edit User
        </Heading>
      </div>
      <form onSubmit={addUser}>
        <SelectMolecule
          value={details.user_type}
          options={getDropDownStatusOptions(
            picked_role?.type === RoleType.INSTITUTION
              ? updateUserTypeWithSuper
              : updateUserType,
          )}
          name="user_type"
          placeholder={'Select user type'}
          handleChange={handleChange}>
          User type
        </SelectMolecule>
        <InputMolecule
          error={errors.first_name}
          name="first_name"
          placeholder="eg: Kabera"
          value={details.first_name}
          handleChange={handleChange}>
          First name
        </InputMolecule>
        <InputMolecule
          error={errors.last_name}
          name="last_name"
          placeholder="eg: Claude"
          value={details.last_name}
          handleChange={handleChange}>
          Last name
        </InputMolecule>
        <InputMolecule
          error={errors.email}
          name="email"
          placeholder="Enter email"
          value={details.email}
          handleChange={handleChange}>
          Email
        </InputMolecule>
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
        {/* <InputMolecule
          name="place_of_residence"
          placeholder={'Enter place of residence'}
          value={details.place_of_residence}
          handleChange={handleChange}>
          Place of residence
        </InputMolecule> */}
        <InputMolecule
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

        <SelectMolecule
          placeholder={'Select your reference'}
          value={details.doc_type}
          handleChange={handleChange}
          name="doc_type"
          options={getDropDownStatusOptions(DocType)}>
          Reference Number
        </SelectMolecule>
        <InputMolecule
          error={errors.nid}
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
            width="60 md:w-80"
            date_time_type={false}>
            Passport expiry date
          </DateMolecule>
        )}
        <SelectMolecule
          options={getDropDownStatusOptions(MaritalStatus)}
          name="marital_status"
          value={details.marital_status}
          handleChange={handleChange}>
          Marital Status
        </SelectMolecule>
        {(details.marital_status === MaritalStatus.MARRIED ||
          details.marital_status === MaritalStatus.WIDOWED) && (
          <InputMolecule
            error={errors.spouse_name}
            name="spouse_name"
            required={false}
            value={details.spouse_name}
            handleChange={handleChange}>
            Spouse Name
          </InputMolecule>
        )}
        <SelectMolecule
          options={getDropDownStatusOptions(EducationLevel)}
          name="education_level"
          value={details.education_level}
          handleChange={handleChange}>
          Education level
        </SelectMolecule>
        {/* {user?.user_type === UserType.SUPER_ADMIN && details.user_type !== 'SUPER_ADMIN' && (
          <SelectMolecule
            error={errors.academy_id}
            options={getDropDownOptions({ inputs: academies || [] })}
            name="academy_id"
            value={details?.academy_id}
            placeholder={'Academy to be enrolled in'}
            handleChange={handleChange}>
            Academy
          </SelectMolecule>
        )} */}
        {/* {details.user_type === 'STUDENT' && (
          <>
            <SelectMolecule
              error={errors.intake_program_id}
              options={getDropDownOptions({
                inputs: intakes.data?.data.data || [],
                labelName: ['code'],
              })}
              name="intake"
              value={otherDetails.intake}
              placeholder={'intake to be enrolled in'}
              handleChange={otherhandleChange}>
              Intake
            </SelectMolecule>
            <SelectMolecule
              error={errors.intake_program_id}
              options={getDropDownOptions({
                inputs: programs.data?.data.data || [],
                labelName: ['name'],
                //@ts-ignore
                getOptionLabel: (prog: IntakeProgramInfo) => prog.program.code,
              })}
              name="intake_program_id"
              value={details.intake_program_id}
              placeholder={'Program to be enrolled in'}
              handleChange={handleChange}>
              Programs
            </SelectMolecule>
            <SelectMolecule
              options={getDropDownOptions({
                inputs: levels.data?.data.data || [],
                labelName: ['name'], //@ts-ignore
                getOptionLabel: (level) => level.level && level.level.name,
              })}
              name="academic_program_level_id"
              placeholder={'Program to be enrolled in'}
              value={details.academic_program_level_id}
              handleChange={handleChange}>
              Levels
            </SelectMolecule>
          </>
        )} */}
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
