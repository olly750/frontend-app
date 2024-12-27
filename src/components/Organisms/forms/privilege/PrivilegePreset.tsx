/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import {
  getPrivilegesByRole,
  getRolesByAcademy,
  roleStore,
} from '../../../../store/administration';
import academyStore from '../../../../store/administration/academy.store';
import { AddPrivilegeReq, PresetRolePropType, ValueType } from '../../../../types';
import { getDropDownOptions } from '../../../../utils/getOption';
import Badge from '../../../Atoms/custom/Badge';
import Button from '../../../Atoms/custom/Button';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

function PrivilegePreset({ role, onSubmit }: PresetRolePropType) {
  const history = useHistory();
  const [priv, setPriv] = useState<AddPrivilegeReq>({
    roleId: role?.id + '',
    privileges: '',
  }); // const [roles, setRoles] = useState<RoleRes[]>([]);
  const [selectedAcademy, setSelectedAcademy] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>();
  const { mutateAsync, isLoading: isSaving } = roleStore.addPrivilegesOnRole();
  const { data: academies, isLoading } = academyStore.fetchAcademies();

  const { data: rolePrivileges } = getPrivilegesByRole(selectedRole + '', !!selectedRole);
  const { data } = getRolesByAcademy(selectedAcademy);

  const roles = data?.data.data.filter((rl) => rl.id != role?.id) || [];

  useEffect(() => {
    let privileges = rolePrivileges?.data.data
      ? rolePrivileges.data.data.map((priv) => priv.privilege.id)
      : undefined;

    let privs = privileges?.map((priv) => priv).join(',');

    privs &&
      setPriv({
        roleId: role?.id + '',
        privileges: privs,
      });
  }, [role, rolePrivileges?.data.data]);

  const savePrivileges = () => {
    if (selectedRole) {
      const toastId = toast.loading('adding privileges to role');

      mutateAsync(priv, {
        onSuccess: () => {
          onSubmit();
          toast.success('Privilege(s) Added', { id: toastId });
          queryClient.invalidateQueries(['privilegesByRole/id', selectedRole]);
          history.push(`/dashboard/role/${role?.id}/view`);
        },
        onError: () => {
          toast.error('something wrong happened adding privileges on role', {
            id: toastId,
          });
        },
      });
    } else {
      toast.error('You must select a role for presets');
    }
  };

  return (
    <>
      <SelectMolecule
        error={selectedAcademy == '' ? 'Academy is required' : ''}
        options={getDropDownOptions({ inputs: academies?.data.data || [] })}
        name="academy_id"
        loading={isLoading}
        value={selectedAcademy}
        handleChange={(e: ValueType) => setSelectedAcademy(e.value.toString())}>
        Academy
      </SelectMolecule>

      {selectedAcademy &&
        (roles.length === 0 ? (
          <Badge
            fontWeight="medium"
            fontSize="sm"
            badgecolor="main"
            badgetxtcolor="txt-secondary"
            className="mx-2">
            No other roles are available now
          </Badge>
        ) : (
          <>
            <div className="grid grid-cols-3 max-h-80 overflow-y-scroll">
              {roles.map((role) => (
                <div
                  onClick={() => setSelectedRole(role.id.toString())}
                  key={role.id}
                  className="py-2">
                  <Badge
                    badgecolor={'secondary'}
                    badgetxtcolor={'txt-primary'}
                    className={`${
                      selectedRole == role.id ? 'border border-primary-600' : ''
                    } py-2 cursor-pointer hover:border hover:border-primary-400`}>
                    {role.name}
                  </Badge>
                </div>
              ))}
            </div>

            {/* save button */}
            <div className="mt-5">
              <Button type="button" onClick={savePrivileges} isLoading={isSaving}>
                save
              </Button>
            </div>
          </>
        ))}
    </>
  );
}

export default PrivilegePreset;
