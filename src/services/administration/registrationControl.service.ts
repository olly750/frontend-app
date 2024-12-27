import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  IRegistrationControlCreateInfo,
  IRegistrationControlInfo,
  IRegistrationControlUpdateInfo,
} from '../../types/services/registrationControl.types';

class RegistrationControlService {
  public async addNew(
    regControlInfo: IRegistrationControlCreateInfo,
  ): Promise<AxiosResponse<Response<IRegistrationControlInfo>>> {
    return await adminstrationAxios.post(
      '/regControls/addRegistrationControl',
      regControlInfo,
    );
  }

  public async getAll(): Promise<AxiosResponse<Response<IRegistrationControlInfo[]>>> {
    return await adminstrationAxios.get('/regControls/getRegistrationControls');
  }

  public async getById(
    id: string,
  ): Promise<AxiosResponse<Response<IRegistrationControlInfo>>> {
    return await adminstrationAxios.get(`/regControls/getRegistrationControlById/${id}`);
  }

  public async getByAcademy(
    id: string,
  ): Promise<AxiosResponse<Response<IRegistrationControlInfo[]>>> {
    return await adminstrationAxios.get(
      `/regControls/getRegistrationControlsByAcademy/${id}`,
    );
  }

  public async update(
    regControl: IRegistrationControlUpdateInfo,
  ): Promise<AxiosResponse<Response<IRegistrationControlInfo>>> {
    return await adminstrationAxios.put('regControls/modifyRegistrationControl/', {
      ...regControl,
    });
  }
}

export const registrationControlService = new RegistrationControlService();
