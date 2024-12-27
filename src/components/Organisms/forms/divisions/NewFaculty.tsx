import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { divisionStore } from '../../../../store/administration/divisions.store';
import { IDivisionsAcademyType, ValueType } from '../../../../types';
import {
  DivisionCreateInfo,
  FacultyErrors,
} from '../../../../types/services/division.types';
import { useDivisionValidation } from '../../../../validations/division.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function NewFaculty({ onSubmit, academy_id }: IDivisionsAcademyType) {
  const [division, setDivision] = useState<DivisionCreateInfo>({
    id: '',
    academy_id: academy_id || '',
    code: '',
    description: '',
    division_type: 'FACULTY',
    name: '',
  });

  const { facultySchema } = useDivisionValidation();

  const initialErrorState: FacultyErrors = {
    name: '',
    description: '',
  };

  const [errors, setErrors] = useState<FacultyErrors>(initialErrorState);

  const { mutateAsync, isLoading } = divisionStore.createDivision();
  const history = useHistory();
  const { t } = useTranslation();

  function handleChange({ name, value }: ValueType) {
    setDivision((old) => ({ ...old, [name]: value }));
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = facultySchema.validate(division, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(division, {
          onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries([
              'division',
              division.division_type,
              division.academy_id,
            ]);
            history.push('/dashboard/divisions');
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: FacultyErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof FacultyErrors] = el.message;
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
        {t('Faculty')} name
      </InputMolecule>
      {/* model code
    {/* module description */}
      <TextAreaMolecule
        required={false}
        error={errors.description}
        value={division.description}
        name="description"
        handleChange={handleChange}>
        Description
      </TextAreaMolecule>

      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Add
        </Button>
      </div>
    </form>
  );
}
