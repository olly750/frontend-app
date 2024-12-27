import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import RadioMolecule from '../../components/Molecules/input/RadioMolecule';
import TextAreaMolecule from '../../components/Molecules/input/TextAreaMolecule';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
// import { divisionStore } from '../../store/administration/divisions.store';
import programStore from '../../store/administration/program.store';
import usersStore from '../../store/administration/users.store';
import { Link as LinkList } from '../../types';
import { CommonFormProps, ParamType, ValueType } from '../../types';
import {
  ProgramErrors,
  ProgramStatus,
  ProgramType,
  UpdateProgramInfo,
} from '../../types/services/program.types';
import { UserInfo, UserType } from '../../types/services/user.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../../utils/getOption';
import { programSchema } from '../../validations/program.validation';

interface IUpdateAcademicProgram<K> extends CommonFormProps<K> {}
export default function UpdateAcademicProgram<E>({
  onSubmit,
}: IUpdateAcademicProgram<E>) {
  const history = useHistory();
  const { id } = useParams<ParamType>();
  const { t } = useTranslation();

  const picked_role = usePickedRole();
  const { data: users } = usersStore.getUsersByAcademyAndUserType(
    picked_role?.academy_id + '',
    UserType.INSTRUCTOR,
    { page: 0, pageSize: 1000, sortyBy: 'username' },
  );

  const instructors = users?.data.data.content || [];

  const rankedInstructors = instructors.filter((inst) => inst.person?.current_rank) || [];
  const unrankedInstructors =
    instructors.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.person && b.person) {
      return a.person.current_rank?.priority - b.person.current_rank?.priority;
    } else {
      return 0;
    }
  });
  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  const { data } = programStore.getProgramById(id);

  // const departments = divisionStore.getDivisionByType('DEPARTMENT').data?.data.data;

  const [details, setDetails] = useState<UpdateProgramInfo>({
    code: '',
    id: '',
    in_charge_id: '',
    department_id: '',
    description: '',
    name: '',
    type: ProgramType.SHORT_COURSE,
    status: ProgramStatus.ACTIVE,
  });

  const initialErrorState: ProgramErrors = {
    name: '',
    code: '',
    description: '',
    in_charge_id: '',
  };

  const [errors, setErrors] = useState<ProgramErrors>(initialErrorState);

  const { mutate, isLoading } = programStore.modifyProgram();

  useEffect(() => {
    data?.data.data &&
      setDetails({
        ...details,
        department_id: data?.data.data.department.id.toString(),
        id: data?.data.data.id,
        name: data.data.data.name,
        code: data.data.data.code,
        description: data.data.data.description,
        type: data?.data.data.type,
      });
    console.log(details);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  // eslint-disable-next-line no-undef
  const list: LinkList[] = [
    { to: '/', title: 'Home' },
    { to: 'dashboard/divisions', title: t('Division') },
    { to: '/dashboard/divisions/departments', title: 'Departments' },
    { to: `dashboard/programs/${id}/edit`, title: 'Edit ' + t('Program') },
  ];

  function updateProgram<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = programSchema.validate(details, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutate(details, {
          onSuccess() {
            toast.success('Successfully updated ' + t('Program'), { duration: 1200 });
            setTimeout(() => {
              history.goBack();
            }, 900);
          },
          onError(error) {
            toast.error(error + '');
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: ProgramErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ProgramErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <>
      <section>
        <BreadCrumb list={list}></BreadCrumb>
      </section>
      <form onSubmit={updateProgram}>
        <div className="p-6 w-auto lg:w-5/12 pl-6 gap-3 rounded-lg bg-main mt-8">
          <div className="py-5 mb-3 capitalize">
            <Heading color="txt-primary" fontWeight="bold">
              Edit {t('Program')}
            </Heading>
          </div>
          <InputMolecule
            value={details.name}
            required={false}
            error={errors.name}
            handleChange={(e) => handleChange(e)}
            name="name">
            {t('Program')} name
          </InputMolecule>
          <InputMolecule
            value={details.code}
            required={false}
            error={errors.code}
            handleChange={(e) => handleChange(e)}
            name="code">
            {t('Program')} code
          </InputMolecule>
          <RadioMolecule
            className="pb-2"
            value={details.type}
            name="type"
            options={getDropDownStatusOptions(ProgramType)}
            handleChange={(e) => handleChange(e)}>
            {t('Program')} Type
          </RadioMolecule>
          <TextAreaMolecule
            error={errors.description}
            value={details.description}
            name="description"
            handleChange={(e) => handleChange(e)}>
            {t('Program')} description
          </TextAreaMolecule>
          <DropdownMolecule
            error={errors.in_charge_id}
            hasError={errors.in_charge_id !== ''}
            defaultValue={getDropDownOptions({
              inputs: finalInstructors || [],
              labelName: ['username'],
            }).find((incharge) => incharge.value === data?.data.data.current_admin_names)}
            width="64"
            placeholder="Select incharge"
            options={getDropDownOptions({
              inputs: finalInstructors || [],
              labelName: ['first_name', 'last_name'],
              //@ts-ignore
              getOptionLabel: (stud: UserInfo) =>
                `${stud.person?.current_rank?.abbreviation || ''} ${stud.first_name} ${
                  stud.last_name
                }`,
            })}
            name="in_charge_id"
            handleChange={(e: ValueType) => handleChange(e)}>
            Incharge
          </DropdownMolecule>
          {/* <DropdownMolecule
            width="64"
            placeholder="Select department"
            options={getDropDownOptions({ inputs: departments || [] })}
            name="department_id"
            handleChange={(e: ValueType) => handleChange(e)}>
            Department
          </DropdownMolecule> */}
          <RadioMolecule
            value={details.status}
            name="status"
            options={getDropDownStatusOptions(ProgramStatus)}
            handleChange={handleChange}>
            Status
          </RadioMolecule>
          <div className="mt-5">
            <Button type="submit" isLoading={isLoading}>
              Update
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
