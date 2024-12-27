import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { divisionStore } from '../../store/administration/divisions.store';
import { intakeStore } from '../../store/administration/intake.store';
import programStore from '../../store/administration/program.store';
import { GenericStatus, ValueType } from '../../types';
import { DivisionInfo } from '../../types/services/division.types';
import {
  CreateIntakeProgram,
  IntakeProgramsCreate,
} from '../../types/services/intake.types';
import { ProgramInfo } from '../../types/services/program.types';
import { getDropDownOptions } from '../../utils/getOption';

interface PropType {
  submited?: () => void;
}

export default function AddAcademicProgramToIntake({ submited }: PropType) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const { search } = useLocation();
  const intakeId = new URLSearchParams(search).get('intakeId');
  const intake = intakeStore.getIntakeById(intakeId!);
  const [departmentId, setDepartmentId] = useState('');
  const { t } = useTranslation();

  const addProgram = intakeStore.addPrograms();

  const picked_role = usePickedRole();

  const departments: DivisionInfo[] =
    divisionStore.getDivisionsByAcademy('DEPARTMENT', picked_role?.academy_id + '').data
      ?.data.data || [];
  function handleDepartments(e: ValueType) {
    setDepartmentId(e.value.toString());
  }

  let programs: ProgramInfo[] =
    programStore.getProgramsByDepartment(departmentId).data?.data.data || [];

  function handlePrograms(e: ValueType) {
    // @ts-ignore
    setSelectedPrograms(e.value);
  }

  async function submit<T>(e: FormEvent<T>) {
    e.preventDefault();
    setFormLoading(true);
    const toastId = toast.loading('adding programs');

    if (departmentId === '') {
      toast.error('Please select department');
    } else if (selectedPrograms.length === 0) {
      toast.error('Please select programs');
    } else {
      let intakePrograms: IntakeProgramsCreate = {
        description: '',
        intak_id: intakeId!,
        programs: [],
      };

      for (let i = 0; i < selectedPrograms.length; i++) {
        const element: CreateIntakeProgram = {
          description: '',
          intake_id: intakeId!,
          intake_program_id: '',
          program_id: selectedPrograms[i],
          status: GenericStatus.ACTIVE,
        };
        intakePrograms.programs.push(element);
      }

      await addProgram.mutateAsync(intakePrograms, {
        onSuccess(data) {
          toast.success(data.data.message, { id: toastId });
          submited && submited();
        },
        onError(error: any) {
          toast.error(
            error.response.data.message || 'error occurred when adding programs',
            { id: toastId },
          );
        },
      });
    }
  }

  return (
    <form onSubmit={submit}>
      <InputMolecule
        disabled
        name="title"
        placeholder="Intake title"
        value={intake.data?.data.data.title}
        handleChange={() => 0}>
        Intake title
      </InputMolecule>
      <DropdownMolecule
        name="departmentId"
        placeholder="Department"
        handleChange={handleDepartments}
        options={getDropDownOptions({ inputs: departments || [] })}>
        Department
      </DropdownMolecule>
      <DropdownMolecule
        name="programs"
        placeholder={t('Program')}
        handleChange={handlePrograms}
        isMulti
        options={getDropDownOptions({ inputs: programs || [] })}>
        {t('Program')} in this intake
      </DropdownMolecule>
      <div className="pt-3">
        <Button isLoading={formLoading} type="submit">
          Add {t('Program')}
        </Button>
      </div>
    </form>
  );
}
