import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
import { roleStore } from '../../../../store/administration';
import academyStore from '../../../../store/administration/academy.store';
import { CreateRoleReq, FormPropType, RoleType, ValueType } from '../../../../types';
import { AcademyInfo } from '../../../../types/services/academy.types';
import {
  getDropDownOptions,
  getDropDownStatusOptions,
} from '../../../../utils/getOption';
import { newRoleSchema } from '../../../../validations/role.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface NewRoleErrors extends Pick<CreateRoleReq, 'academy_id' | 'name'> {
  chose_academy: boolean;
}

export default function NewRole({ onSubmit }: FormPropType) {
  const { mutateAsync } = roleStore.addRole();
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  const history = useHistory();
  const { data: academy, isLoading } = academyStore.getAcademyById(
    picked_role?.academy_id || '',
  );

  const [form, setForm] = useState<CreateRoleReq>({
    name: '',
    description: '',
    academy_id: '',
    institution_id: '',
    type: RoleType.ACADEMY,
  });

  const initialErrorState: NewRoleErrors = {
    academy_id: '',
    name: '',
    chose_academy: false,
  };

  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    setForm({
      name: '',
      description: '',
      academy_id:
        picked_role?.type !== RoleType.INSTITUTION ? picked_role?.academy_id || '' : '',
      institution_id: user?.institution?.id.toString() || '',
      type: RoleType.ACADEMY,
    });
  }, [picked_role?.academy_id, picked_role?.type, user?.institution?.id]);

  function handleChange({ name, value }: ValueType) {
    setForm((old) => ({ ...old, [name]: value }));
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = newRoleSchema.validate(
      {
        name: form.name,
        academy_id: form.academy_id,
        chose_academy: form.type === RoleType.ACADEMY,
      },
      {
        abortEarly: false,
      },
    );
    validatedForm
      .then(() => {
        mutateAsync(form, {
          onSuccess: () => {
            toast.success('Role created');

            history.goBack();
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        console.log(err);

        const validatedErr: NewRoleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          //@ts-ignore
          validatedErr[el.path as keyof NewRoleErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }
  const academies: AcademyInfo[] | undefined =
    academyStore.fetchAcademies().data?.data.data || [];

  return (
    <form onSubmit={submitForm}>
      {/* model name */}
      {picked_role?.type === RoleType.INSTITUTION ? (
        <>
          <RadioMolecule
            className="pb-2"
            defaultValue={form.type}
            options={getDropDownStatusOptions(RoleType)}
            value={form.type}
            handleChange={handleChange}
            name="type">
            Apply Role On
          </RadioMolecule>
          {form.type === RoleType.ACADEMY ? (
            <SelectMolecule
              error={errors.academy_id}
              hasError={errors.academy_id !== ''}
              options={getDropDownOptions({ inputs: academies || [] })}
              name="academy_id"
              placeholder="select academy"
              value={form.academy_id}
              handleChange={handleChange}>
              Academy
            </SelectMolecule>
          ) : (
            <InputMolecule
              name=""
              readOnly
              value={user?.institution.name}
              handleChange={handleChange}>
              Institution
            </InputMolecule>
          )}
        </>
      ) : (
        <InputMolecule
          readOnly
          value={academy?.data.data.name}
          name={'academy_id'}
          placeholder={isLoading ? 'Loading academy...' : ''}>
          Academy
        </InputMolecule>
      )}
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
          Add
        </Button>
      </div>
    </form>
  );
}
