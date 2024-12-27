/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { levelStore } from '../../../../store/administration/level.store';
import { IDivisionsAcademyType, ParamType, ValueType } from '../../../../types';
import { IcreateLevel, LevelErrors } from '../../../../types/services/levels.types';
import { levelSchema } from '../../../../validations/level.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function UpdateLevel({ onSubmit, academy_id }: IDivisionsAcademyType) {
  const { mutateAsync, isLoading } = levelStore.modifyLevel();
  const history = useHistory();
  const [level, setLevels] = useState<IcreateLevel>({
    name: '',
    description: '',
    id: '',
    academy_id: academy_id || '',
    code: '',
    flow: 0,
  });
  const initialErrorState: LevelErrors = {
    name: '',
    description: '',
    flow: '',
  };

  const [errors, setErrors] = useState<LevelErrors>(initialErrorState);

  const { id } = useParams<ParamType>();

  const { data } = levelStore.getLevelById(id);

  useEffect(() => {
    data?.data.data && setLevels({ ...data?.data.data });
  }, [data]);

  function handleChange(e: ValueType) {
    setLevels((old) => ({ ...old, [e.name]: e.value }));
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = levelSchema.validate(level, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(level, {
          onSuccess: () => {
            queryClient.invalidateQueries(['levels']);
            toast.success('Level updated');
            history.goBack();
          },
          onError: (error: any) => {
            toast.error(error.response.data.message.split(':')[1]);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: LevelErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LevelErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <InputMolecule
        required={false}
        error={errors.name}
        value={level.name}
        handleChange={handleChange}
        placeholder="Enter level name"
        name="name">
        Level name
      </InputMolecule>

      <TextAreaMolecule
        value={level.description}
        name="description"
        required
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      <InputMolecule
        required={false}
        error={errors.flow}
        value={level.flow}
        type="number"
        handleChange={handleChange}
        placeholder="Enter level flow"
        name="flow">
        Flow
      </InputMolecule>
      <Button type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  );
}
