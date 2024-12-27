/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { getUnAssignedPrivileges, roleStore } from '../../../../store/administration';
import {
  AddRolePrivilege,
  PrivilegeFeatureType,
  RolePropType,
  SelectData,
  ValueType,
} from '../../../../types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import ILabel from '../../../Atoms/Text/ILabel';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import MultiselectMolecule from '../../../Molecules/input/MultiselectMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

export default function AddPrivileges({ onSubmit, roleName, roleId }: RolePropType) {
  const [form, setForm] = useState<AddRolePrivilege>({
    roleId: roleId,
    roleType: PrivilegeFeatureType.ADMIN,
    privileges: [],
  });
  const [privileges, setPrivileges] = useState<SelectData[]>([]);
  const { mutateAsync, isLoading } = roleStore.addPrivilegesOnRole();
  const history = useHistory();
  const { data } = getUnAssignedPrivileges(roleId);

  function handleChange(e: ValueType) {
    setForm({ ...form, [e.name]: e.value });
  }

  useEffect(() => {
    if (data?.data.data) {
      let alreadySelected = data?.data.data.filter(
        (item) => form.privileges.findIndex((i) => i == item.id.toString()) > -1,
      );
      let filteredData = data?.data.data.filter((p) => p.featureType == form.roleType);

      setPrivileges(
        ([...filteredData, ...alreadySelected].map((priv) => ({
          label: priv.name,
          value: priv.id,
        })) as SelectData[]) || [],
      );
    }
  }, [form.roleType, data?.data.data]);

  function submitForm<T>(e: FormEvent<T>) {
    let toastId = toast.loading('adding privileges to role');

    console.log('making it happend', roleId);
    e.preventDefault();

    if (form.privileges.length < 1) {
      toast.error('Please select privileges', { id: toastId });
    } else {
      mutateAsync(
        {
          roleId: form.roleId,
          privileges: form.privileges.join(','),
        },
        {
          onSuccess: () => {
            onSubmit(e);
            toast.success('Privilege(s) Added', { id: toastId });
            history.goBack();
          },
          onError: () => {
            toast.error('something wrong happened adding privileges on role', {
              id: toastId,
            });
          },
        },
      );
    }
  }

  return (
    <form onSubmit={submitForm}>
      {/* model name */}
      <InputMolecule
        readOnly
        value={roleName}
        error=""
        handleChange={() => 0}
        name="name">
        Role name
      </InputMolecule>
      <SelectMolecule
        name="roleType"
        value={form.roleType}
        handleChange={handleChange}
        options={getDropDownStatusOptions(PrivilegeFeatureType)}
        placeholder="Select group">
        Privilege group
      </SelectMolecule>
      {/* model code
    {/* module description */}
      <MultiselectMolecule
        handleChange={handleChange}
        options={privileges}
        name="privileges"
        placeholder="Select Privileges"
        value={form.privileges}>
        Select privilege
      </MultiselectMolecule>
      <div className="flex flex-col gap-2">
        <ILabel textTransform="normal-case">Or Select from presets</ILabel>
        <Button
          type="button"
          styleType="outline"
          className="w-1/4"
          onClick={() => history.push(`/dashboard/role/${roleId}/view/addPresets`)}>
          Select presets
        </Button>
      </div>
      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full isLoading={isLoading}>
          Add
        </Button>
      </div>
    </form>
  );
}
