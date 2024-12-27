import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import {
  AddPrivilegeReq,
  CreateRoleReq,
  PrivilegeRes,
  Response,
  RolePrivilege,
  RoleRes,
  RoleUsers,
} from '../../types';

class RoleService {
  public async addRole(role: CreateRoleReq): Promise<AxiosResponse<Response<RoleRes>>> {
    return await adminstrationAxios.post('/roles/addRole', role);
  }

  public async getRoles(): Promise<AxiosResponse<Response<RoleRes[]>>> {
    return await adminstrationAxios.get('/roles/getRoles?type=INSTITUTION');
  }

  public async getUsersByRole(
    roleId: string,
  ): Promise<AxiosResponse<Response<RoleUsers[]>>> {
    return await adminstrationAxios.get(`/roles/getUsersByRole/${roleId}`);
  }

  public async getRole(id: string): Promise<AxiosResponse<Response<RoleRes>>> {
    return await adminstrationAxios.get(`/roles/getRoleById/${id}`);
  }

  public async getRolesByInstitution(
    institutionId: string,
  ): Promise<AxiosResponse<Response<RoleRes[]>>> {
    return await adminstrationAxios.get(`/roles/getRoleByInstitution/${institutionId}`);
  }

  public async getRolesByAcademy(
    academyId: string,
  ): Promise<AxiosResponse<Response<RoleRes[]>>> {
    return await adminstrationAxios.get(`/roles/getRoleByAcademy/${academyId}`);
  }

  public async getPrivilegesByRole(
    roleId: string,
  ): Promise<AxiosResponse<Response<RolePrivilege[]>>> {
    return await adminstrationAxios.get(`/roles/getAssignedPrivileges/${roleId}`);
  }

  public async getUnAssignedPrivilege(
    roleId: string,
  ): Promise<AxiosResponse<Response<PrivilegeRes[]>>> {
    return await adminstrationAxios.get(`/roles/getNotAssignedPrivileges/${roleId}`);
  }

  public async modifyRole(
    role: CreateRoleReq,
  ): Promise<AxiosResponse<Response<RoleRes>>> {
    return await adminstrationAxios.put('/roles/modifyRole', { ...role });
  }

  public async addPrivilegesOnRole(
    role: AddPrivilegeReq,
  ): Promise<AxiosResponse<Response<RoleRes>>> {
    return await adminstrationAxios.put('/roles/addPrivileges', { ...role });
  }

  public async removePrivilege(rolePrivilegeId: string): Promise<AxiosResponse<{}>> {
    return await adminstrationAxios.delete(`/roles/removerPrivileges/${rolePrivilegeId}`);
  }
}

export const roleService = new RoleService();
