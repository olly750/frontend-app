import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { PrivilegeRes, PrivilegeUpdate } from '../../types/services/privilege.types';

class PrivilegeService {
  public async getAllPrivileges(): Promise<AxiosResponse<Response<PrivilegeRes[]>>> {
    return await adminstrationAxios.get('/privileges/getPrivileges');
  }

  public async getPrivilege(id: string): Promise<AxiosResponse<Response<PrivilegeRes>>> {
    return await adminstrationAxios.get(`/privileges/getPrivilegeById/${id}`);
  }

  public async modifyPrivilege(
    privilege: PrivilegeUpdate,
  ): Promise<AxiosResponse<Response<PrivilegeRes>>> {
    return await adminstrationAxios.put('/privileges/modifyPrivilege', { ...privilege });
  }

  public async getPrivilegeBySearch(
    text: string,
  ): Promise<AxiosResponse<Response<PrivilegeRes[]>>> {
    return await adminstrationAxios.get(`/privileges/search?searchKey=${text}`);
  }
}

export const privilegeService = new PrivilegeService();
