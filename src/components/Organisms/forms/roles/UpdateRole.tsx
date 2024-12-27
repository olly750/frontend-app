import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { roleStore } from '../../../../store/administration';
import {
  CreateRoleReq,
  FormPropType,
  ParamType,
  RoleType,
  ValueType,
} from '../../../../types';
import { updateSchema } from '../../../../validations/role.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface UpdateRoleErrors extends Pick<CreateRoleReq, 'name'> {}

export default function UpdateRole({ onSubmit }: FormPropType) {
  const [form, setForm] = useState<CreateRoleReq>({
    name: '',
    description: '',
    academy_id: '',
    institution_id: '',
    type: RoleType.ACADEMY,
  });

  const initialErrorState: UpdateRoleErrors = {
    name: '',
  };

  const [errors, setErrors] = useState(initialErrorState);
  const { mutateAsync } = roleStore.modifyRole();
  const history = useHistory();

  const { id } = useParams<ParamType>();

  const { data } = roleStore.getRole(id);

  useEffect(() => {
    data?.data.data && setForm({ ...data?.data.data });
  }, [data]);

  function handleChange({ name, value }: ValueType) {
    setForm((old) => ({ ...old, [name]: value }));
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    const validatedForm = updateSchema.validate(
      {
        name: form.name,
      },
      {
        abortEarly: false,
      },
    );

    validatedForm
      .then(() => {
        mutateAsync(form, {
          onSuccess: () => {
            toast.success('Role updated');
            history.goBack();
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: UpdateRoleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof UpdateRoleErrors] = el.message;
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
        value={form.name}
        handleChange={handleChange}
        name="name">
        Role name
      </InputMolecule>
      {/* model code
    {/* module description */}
      <TextAreaMolecule
        required={false}
        value={form.description}
        name="description"
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full>
          Save
        </Button>
      </div>
    </form>
  );
}
