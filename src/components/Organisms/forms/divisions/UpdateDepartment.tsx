import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
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

export default function UpdateDepartment({ onSubmit }: IDivisionsAcademyType) {
  const history = useHistory();

  const { id } = useParams<ParamType>();
  const { t } = useTranslation();

  const { departSchema } = useDivisionValidation();

  const { data } = divisionStore.getDivision(id);

  const [division, setDivision] = useState<DivisionCreateInfo>({
    academy_id: '',
    code: '',
    description: '',
    division_type: 'DEPARTMENT',
    id: '',
    name: '',
    parent_id: '',
  });

  const { mutateAsync, isLoading } = divisionStore.updateDivision();

  const updateDivisionInfo: any = {
    academy_id: division.academy?.id,
    code: '',
    description: division.description,
    division_type: 'DEPARTMENT',
    id: id,
    name: division.name,
    parent_id: division.parent_id,
  };

  const initialErrorState: DepartErrors = {
    name: '',
    description: '',
    faculty: '',
  };

  const [errors, setErrors] = useState<DepartErrors>(initialErrorState);
  useEffect(() => {
    data?.data && setDivision(data?.data.data);
  }, [data]);

  const departments = divisionStore.getDivisionByType('FACULTY').data?.data.data;

  function handleChange({ name, value }: ValueType) {
    setDivision((old) => ({ ...old, [name]: value }));
  }
  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const cloneDivision = { ...division };
    Object.assign(cloneDivision, { has_faculty: true });

    const validatedForm = departSchema.validate(cloneDivision, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(updateDivisionInfo, {
          onSuccess: () => {
            toast.success('Department updated');
            queryClient.invalidateQueries(['divisions/type', division.division_type]);

            history.goBack();
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
      <InputMolecule
        required={false}
        error={errors.name}
        value={division.name}
        handleChange={handleChange}
        name="name">
        Department name
      </InputMolecule>
      <TextAreaMolecule
        required={false}
        error={errors.description}
        value={division.description}
        name="description"
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      <DropdownMolecule
        error={errors.faculty}
        width="82"
        placeholder={'Select ' + t('Faculty')}
        options={getDropDownOptions({ inputs: departments || [] })}
        name="parent_id"
        handleChange={handleChange}>
        {t('Faculty')}
      </DropdownMolecule>
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Add
        </Button>
      </div>
    </form>
  );
}
