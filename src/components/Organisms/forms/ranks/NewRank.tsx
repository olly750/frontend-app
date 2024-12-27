import React, { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import { rankStore } from '../../../../store/administration/rank.store';
import { FormPropType, ValueType } from '../../../../types';
import {
  CreateRankReq,
  RankCategory,
  RankErrors,
} from '../../../../types/services/rank.types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import { rankSchema } from '../../../../validations/rank.validation';
import Button from '../../../Atoms/custom/Button';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function NewRank({ onSubmit }: FormPropType) {
  const [form, setForm] = useState<CreateRankReq>({
    name: '',
    description: '',
    abbreviation: '',
    priority: 0,
    category: RankCategory.GENERALS,
    institution_id: '',
  });
  const initialErrorState: RankErrors = {
    name: '',
    description: '',
    abbreviation: '',
    priority: '',
  };
  const [errors, setErrors] = useState(initialErrorState);

  const { mutateAsync, isLoading } = rankStore.addRank();
  const history = useHistory();

  const { user } = useAuthenticator();
  useEffect(() => {
    setForm((form) => ({
      ...form,
      institution_id: user?.institution.id + '',
    }));
  }, [user?.id, user?.institution.id]);

  function handleChange({ name, value }: ValueType) {
    setForm((old) => ({ ...old, [name]: value }));
  }
  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = rankSchema.validate(form, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(form, {
          onSuccess: () => {
            toast.success('Rank created');
            history.goBack();
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: RankErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof RankErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      {/* model category */}
      <DropdownMolecule
        defaultValue={getDropDownStatusOptions(RankCategory).find(
          (categ) => categ.value === form.category,
        )}
        options={getDropDownStatusOptions(RankCategory)}
        name="category"
        placeholder={'Select the Rank Category'}
        handleChange={handleChange}>
        Rank Category
      </DropdownMolecule>
      {/* model name */}
      <InputMolecule
        required={false}
        error={errors.name}
        value={form.name}
        handleChange={handleChange}
        name="name">
        Rank name
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.abbreviation}
        value={form.abbreviation}
        handleChange={handleChange}
        name="abbreviation">
        Rank abbreviation
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.priority}
        value={form.priority}
        handleChange={handleChange}
        type="number"
        name="priority">
        Rank priority
      </InputMolecule>
      {/* model code
      {/* module description */}
      <TextAreaMolecule
        error={errors.description}
        value={form.description}
        name="description"
        handleChange={handleChange}>
        Description
      </TextAreaMolecule>

      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Create Rank
        </Button>
      </div>
    </form>
  );
}
