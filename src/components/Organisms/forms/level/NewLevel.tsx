import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { levelStore } from '../../../../store/administration/level.store';
import { IDivisionsAcademyType, ValueType } from '../../../../types';
import { IcreateLevel, LevelErrors } from '../../../../types/services/levels.types';
import { levelSchema } from '../../../../validations/level.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

function NewLevel({ onSubmit, academy_id }: IDivisionsAcademyType) {
  const [level, setLevel] = useState<IcreateLevel>({
    academy_id: academy_id || '',
    code: '',
    description: '',
    name: '',
    id: '',
    flow: 0,
  });

  useEffect(() => {
    setLevel((level) => ({ ...level, academy_id: academy_id || '' }));
  }, [academy_id]);

  const initialErrorState: LevelErrors = {
    name: '',
    description: '',
    flow: '',
  };

  const [errors, setErrors] = useState<LevelErrors>(initialErrorState);

  const history = useHistory();
  const { mutateAsync, isLoading } = levelStore.addLevel();

  function handleChange(e: ValueType) {
    setLevel({ ...level, [e.name]: e.value });
  }

  function submitForm(e: FormEvent) {
    e.preventDefault(); // prevent page to reload:

    const validatedForm = levelSchema.validate(level, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(level, {
          onSuccess: () => {
            toast.success('Level created');
            queryClient.invalidateQueries(['levels/academy', academy_id]);
            history.goBack();
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
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
        error={errors.description}
        value={level.description}
        name="description"
        handleChange={handleChange}>
        Descripton
      </TextAreaMolecule>

      <InputMolecule
        error={errors.flow}
        value={level.flow}
        type="number"
        handleChange={handleChange}
        placeholder="Enter level flow"
        name="flow">
        Flow
      </InputMolecule>

      <Button isLoading={isLoading} type="submit">
        Save
      </Button>
    </form>
  );
}

export default NewLevel;
