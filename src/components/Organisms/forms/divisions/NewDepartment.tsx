import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { divisionStore } from '../../../../store/administration/divisions.store';
import { IDivisionsAcademyType, ParamType, ValueType } from '../../../../types';
import {
  DepartErrors,
  DivisionCreateInfo,
} from '../../../../types/services/division.types';
import { getDropDownOptions } from '../../../../utils/getOption';
import { useDivisionValidation } from '../../../../validations/division.validation';
import Button from '../../../Atoms/custom/Button';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function NewDepartment({ onSubmit, academy_id }: IDivisionsAcademyType) {
  const { id: facultyId } = useParams<ParamType>();

  const { departSchema } = useDivisionValidation();

  const [division, setDivision] = useState<DivisionCreateInfo>({
    academy_id: academy_id || '',
    code: '',
    description: '',
    division_type: 'DEPARTMENT',
    id: '',
    name: '',
    parent_id: facultyId ? facultyId : '',
  });

  const initialErrorState: DepartErrors = {
    name: '',
    description: '',
    faculty: '',
  };

  const [errors, setErrors] = useState<DepartErrors>(initialErrorState);

  const { mutateAsync, isLoading } = divisionStore.createDivision();
  const history = useHistory();
  const { t } = useTranslation();

  function handleChange({ name, value }: ValueType) {
    setDivision((old) => ({ ...old, [name]: value }));
  }

  const faculties = divisionStore.getDivisionByType('FACULTY').data?.data.data;

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const cloneDivision = { ...division };
    Object.assign(cloneDivision, { has_faculty: !facultyId });

    const validatedForm = departSchema.validate(cloneDivision, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(division, {
          onSuccess: () => {
            toast.success('Department created');
            if (facultyId) {
              history.push({
                pathname: `/dashboard/divisions/departments`,
                search: `?fac=${facultyId}`,
              });
            }
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: DepartErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof DepartErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }
  return (
    <form onSubmit={submitForm}>
      {/* model name */}
      <InputMolecule
        required={false}
        error={errors.name}
        value={division.name}
        handleChange={handleChange}
        name="name">
        Department name
      </InputMolecule>

      {/* department description */}
      <TextAreaMolecule
        required={false}
        error={errors.description}
        value={division.description}
        name="description"
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      {!facultyId && (
        <DropdownMolecule
          error={errors.faculty}
          width="82"
          placeholder="Select faculty"
          options={getDropDownOptions({ inputs: faculties || [] })}
          name="parent_id"
          handleChange={handleChange}>
          {t('Faculty')}
        </DropdownMolecule>
      )}

      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Add
        </Button>
      </div>
    </form>
  );
}
