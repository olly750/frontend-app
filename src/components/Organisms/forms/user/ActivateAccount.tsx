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
import usersStore from '../../../../store/administration/users.store';
import { ParamType, RoleType, ValueType } from '../../../../types';
import { AcademyInfo } from '../../../../types/services/academy.types';
import { AccountStatus, AssignUserRole } from '../../../../types/services/user.types';
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

export default function ActivateAcount() {
  const { id: userId } = useParams<ParamType>();
  const history = useHistory();

  const { data: userData, isLoading } = usersStore.getUserById(userId);




  const { user } = useAuthenticator();
  const [genericStatus, setGenericStatus] = useState(userData?.data.data.generic_status);
  // console.log("user",userData?.data.data)


  const { mutate } = usersStore.changeUserStatus();

  function handleChange(e: ValueType) {
    const value: any = e.value as string[];
    setGenericStatus(value);
  }



  function saveGenericStatus(e: FormEvent) {
    e.preventDefault();
    const statusObj: any = {
      "profile_status": userData?.data.data.profile_status,
      "status": genericStatus,
      "user_id": userData?.data.data.id
    }


    mutate(statusObj, {
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


  return (
    <form onSubmit={saveGenericStatus}>
      <DropdownMolecule
        // error={errors.roles}
        //isMulti
        name="genericStatus"
        handleChange={handleChange}
        options={getDropDownStatusOptions(AccountStatus)}
        placeholder={isLoading ? 'Loading statuses...' : 'Select status'}>
        Select status
      </DropdownMolecule>
      <div className="pt-3">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
