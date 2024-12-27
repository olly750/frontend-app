import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';

import { roleService } from '../../services';
import { PrivilegeRes, Response, RolePrivilege, RoleRes } from '../../types';
import { RoleUsers } from './../../types/services/role.types';

class RoleStore {
  addRole() {
    return useMutation(roleService.addRole);
  }
  getRoles() {
    return useQuery('roles', roleService.getRoles);
  }

  getRole(id: string) {
    return useQuery<AxiosResponse<Response<RoleRes>>, Response>(['roles/id', id], () =>
      roleService.getRole(id),
    );
  }

  modifyRole() {
    return useMutation(roleService.modifyRole);
  }

  addPrivilegesOnRole() {
    return useMutation(roleService.addPrivilegesOnRole);
  }

  removeProvilege() {
    return useMutation(roleService.removePrivilege);
  }
}

export const getUsersByRole = (roleId: string, enabled = true) => {
  return useQuery<AxiosResponse<Response<RoleUsers[]>>, Response>(
    ['role/users', roleId],
    () => roleService.getUsersByRole(roleId),
    { enabled },
  );
};

export const getUnAssignedPrivileges = (roleId: string, enabled = true) => {
  return useQuery<AxiosResponse<Response<PrivilegeRes[]>>, Response>(
    ['unAssignedPrivileges/id', roleId],
    () => roleService.getUnAssignedPrivilege(roleId),
    { enabled },
  );
};

export const getPrivilegesByRole = (roleId: string, enabled = true) => {
  return useQuery<AxiosResponse<Response<RolePrivilege[]>>, Response>(
    ['privilegesByRole/id', roleId],
    () => roleService.getPrivilegesByRole(roleId),
    { enabled },
  );
};

export function getRolesByAcademy(academyId: string) {
  return useQuery(
    ['role/academyId', academyId],
    () => roleService.getRolesByAcademy(academyId),
    { enabled: !!academyId },
  );
}

export function getRolesByInstitution(institutionId: string) {
  return useQuery(
    ['role/institutionId', institutionId],
    () => roleService.getRolesByInstitution(institutionId),
    { enabled: !!institutionId },
  );
}

export const roleStore = new RoleStore();
