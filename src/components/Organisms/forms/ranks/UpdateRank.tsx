import React from 'react';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import { rankStore } from '../../../../store/administration/rank.store';
import { FormPropType, ParamType, ValueType } from '../../../../types';
import {
  RankCategory,
  RankErrors,
  UpdateRankReq,
} from '../../../../types/services/rank.types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import { rankSchema } from '../../../../validations/rank.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function UpdateRank({ onSubmit }: FormPropType) {
  const [form, setForm] = useState<UpdateRankReq>({
    name: '',
    description: '',
    category: RankCategory.GENERALS,
    institution_id: '',
    abbreviation: '',
    priority: 0,
    id: '',
  });
  const initialErrorState: RankErrors = {
    name: '',
    description: '',
    abbreviation: '',
    priority: '',
  };
  const [errors, setErrors] = useState(initialErrorState);

  const { mutateAsync, isLoading } = rankStore.modifyRank();
  const history = useHistory();

  const { id } = useParams<ParamType>();

  const { data } = rankStore.getRank(id);
  const { user } = useAuthenticator();

  useEffect(() => {
    data?.data.data &&
      setForm({ ...data?.data.data, institution_id: user?.institution.id + '', id: id });
  }, [data, id, user?.institution.id]);

  // useEffect(() => {
  //   const { user } = useAuthenticator();
  //   data?.data.data &&
  //     setForm({
  //       ...data?.data.data,
  //       institution_id: user?.institution_id || 'b832407f-fb77-4a75-8679-73bf7794f207',
  //     });
  // }, [data, form]);

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
            toast.success('Rank updated');
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
      <SelectMolecule
        value={form.category}
        options={getDropDownStatusOptions(RankCategory)}
        name="category"
        placeholder={'Select the Rank Category'}
        handleChange={handleChange}>
        Rank Category
      </SelectMolecule>
      {/* model name */}
      <InputMolecule
        required
        value={form.name}
        error={errors.name}
        handleChange={handleChange}
        name="name">
        Rank name
      </InputMolecule>
      <InputMolecule
        required
        value={form.abbreviation}
        error={errors.abbreviation}
        handleChange={handleChange}
        name="abbreviation">
        Rank abbreviation
      </InputMolecule>
      <InputMolecule
        required
        value={form.priority}
        error={errors.priority}
        handleChange={handleChange}
        type="number"
        name="priority">
        Rank priority
      </InputMolecule>
      {/* model code
      {/* module description */}
      <TextAreaMolecule
        value={form.description}
        error={errors.description}
        name="description"
        required
        handleChange={handleChange}>
        Description
      </TextAreaMolecule>

      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Update Rank
        </Button>
      </div>
    </form>
  );
}
