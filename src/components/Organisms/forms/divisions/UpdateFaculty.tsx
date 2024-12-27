import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { divisionStore } from '../../../../store/administration/divisions.store';
import { IDivisionsAcademyType, ParamType, ValueType } from '../../../../types';
import {
  DivisionCreateInfo,
  FacultyErrors,
} from '../../../../types/services/division.types';
import { useDivisionValidation } from '../../../../validations/division.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function UpdateDepartment({ onSubmit }: IDivisionsAcademyType) {
  const history = useHistory();

  const { id } = useParams<ParamType>();

  const { data } = divisionStore.getDivision(id);

  const { facultySchema } = useDivisionValidation();

  const [division, setDivision] = useState<DivisionCreateInfo>({
    academy_id: '',
    code: '',
    description: '',
    division_type: 'FACULTY',
    id: '',
    name: '',
    parent_id: '',
  });

  const { mutateAsync, isLoading } = divisionStore.updateDivision();

  const updateDivisionInfo: any = {
    academy_id: division.academy?.id,
    code: '',
    description: division.description,
    division_type: 'FACULTY',
    id: id,
    name: division.name,
    parent_id: division.parent_id,
  };
  const initialErrorState: FacultyErrors = {
    name: '',
    description: '',
  };
  const { t } = useTranslation();

  const [errors, setErrors] = useState<FacultyErrors>(initialErrorState);

  useEffect(() => {
    data?.data && setDivision(data?.data.data);
  }, [data]);

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
        mutateAsync(updateDivisionInfo, {
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
      <InputMolecule
        required={false}
        error={errors.name}
        value={division.name}
        handleChange={handleChange}
        name="name">
        {t('Faculty')} name
      </InputMolecule>
      <TextAreaMolecule
        required={false}
        error={errors.description}
        value={division.description}
        name="description"
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
}
