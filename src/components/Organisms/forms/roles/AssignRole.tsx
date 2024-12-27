import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import {
  getRolesByAcademy,
  getRolesByInstitution,
} from '../../../../store/administration';
import academyStore from '../../../../store/administration/academy.store';
import usersStore from '../../../../store/administration/users.store';
import { ParamType, RoleType, ValueType } from '../../../../types';
import { AcademyInfo } from '../../../../types/services/academy.types';
import { AssignUserRole } from '../../../../types/services/user.types';
import {
  getDropDownOptions,
  getDropDownStatusOptions,
} from '../../../../utils/getOption';
import { userAssignRoleSchema } from '../../../../validations/role.validation';
import Button from '../../../Atoms/custom/Button';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

interface RoleErrors {
  academy_id: string;
  // roles: string;
}

export default function AssignRole() {
  const { id: userId } = useParams<ParamType>();
  const history = useHistory();

  const { data: userRoles } = usersStore.getUserRoles(userId);

  const initialErrorState: RoleErrors = {
    academy_id: '',
    // roles: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const [roles, setRoles] = useState<string[]>([]);
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  const [roleInfo, setRoleInfo] = useState({
    name: '',
    description: '',
    academy_id: '',
    institution_id: '',
    type: RoleType.ACADEMY,
  });

  useEffect(() => {
    setRoleInfo((role) => ({ ...role, institution_id: user?.institution.id + '' }));
  }, [user?.institution.id]);

  const { data, isLoading } =
    picked_role?.type === RoleType.ACADEMY
      ? getRolesByAcademy(picked_role.academy_id)
      : roleInfo.type === RoleType.ACADEMY
      ? getRolesByAcademy(roleInfo.academy_id)
      : getRolesByInstitution(roleInfo.institution_id);

  const { mutate } = usersStore.assignRole();

  function handleChange(e: ValueType) {
    const value = e.value as string[];
    setRoles(value);
  }

  function otherHandleChange({ name, value }: ValueType) {
    if (picked_role?.type === RoleType.ACADEMY)
      setRoleInfo((old) => ({
        ...old,
        [name]: value,
        ['academyId']: picked_role?.academy_id,
      }));
    else setRoleInfo((old) => ({ ...old, [name]: value }));
  }

  function saveRoles(e: FormEvent) {
    e.preventDefault();
    const validatedForm = userAssignRoleSchema.validate(
      {
        academy_id: roleInfo.academy_id,
        // roles: roles,
        chose_academy:
          picked_role?.type !== RoleType.ACADEMY && roleInfo.type === RoleType.ACADEMY,
      },
      {
        abortEarly: false,
      },
    );

    validatedForm
      .then(() => {
        if (roles.length === 0) {
          toast.error('Please select roles');
        } else {
          let user_roles: AssignUserRole[] = [];

          roles.map((role) => {
            user_roles.push({
              description: '',
              role_id: +role,
              user_id: userId,
            });
          });

          mutate(user_roles, {
            onSuccess(data) {
              toast.success(data.data.message);
              queryClient.invalidateQueries('roles');
              history.push(`/dashboard/users`);
            },
            onError(error: any) {
              toast.error(error.response.data.message);
            },
          });
        }
      })
      .catch((err) => {
        const validatedErr: RoleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof RoleErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  const userRolesId = userRoles?.data.data.map((role) => role.role.id) || [];

  const roleOptions =
    data?.data.data.filter((role) => !userRolesId.includes(role.id)) || [];

  const academies: AcademyInfo[] | undefined =
    academyStore.fetchAcademies().data?.data.data || [];

  return (
    <form onSubmit={saveRoles}>
      <>
        {picked_role?.type === RoleType.INSTITUTION && (
          <RadioMolecule
            className="pb-2"
            defaultValue={roleInfo.type}
            options={getDropDownStatusOptions(RoleType)}
            value={roleInfo.type}
            handleChange={otherHandleChange}
            name="type">
            Apply Role On
          </RadioMolecule>
        )}
        {picked_role?.type === RoleType.ACADEMY ? (
          <InputMolecule
            required={false}
            readOnly
            value={
              academies.find((academy) => academy.id === picked_role?.academy_id)?.name
            }
            name={'academyId'}>
            Academy
          </InputMolecule>
        ) : roleInfo.type === RoleType.ACADEMY ? (
          <SelectMolecule
            error={errors.academy_id}
            hasError={errors.academy_id !== ''}
            options={getDropDownOptions({ inputs: academies || [] })}
            name="academy_id"
            placeholder="select academy"
            value={roleInfo.academy_id}
            handleChange={otherHandleChange}>
            Academy
          </SelectMolecule>
        ) : (
          <InputMolecule
            name=""
            required={false}
            readOnly
            value={user?.institution.name}
            handleChange={otherHandleChange}>
            Institution
          </InputMolecule>
        )}
      </>
      <DropdownMolecule
        // error={errors.roles}
        isMulti
        name="role"
        handleChange={handleChange}
        options={getDropDownOptions({ inputs: roleOptions })}
        placeholder={isLoading ? 'Loading roles...' : 'Select role'}>
        Select roles
      </DropdownMolecule>
      <div className="pt-3">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
