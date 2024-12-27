import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { BasicPersonInfo } from '../../types/services/user.types';
import { CreateNextOfKin, NextKinInfo } from '../../types/services/usernextkin.types';

class UserNextKinService {
  public async createUserNextKin(
    NextKeenInfo: CreateNextOfKin,
  ): Promise<AxiosResponse<Response<NextKinInfo>>> {
    return await adminstrationAxios.post('/users/addHisNextOfKins', NextKeenInfo);
  }

  public async removeUserNextKin(
    NextKeenInfo: CreateNextOfKin,
  ): Promise<AxiosResponse<Response<NextKinInfo>>> {
    return await adminstrationAxios.put('/users/removeHisNextOfKins', NextKeenInfo);
  }

  public async getHisNextById(
    userId: string,
  ): Promise<AxiosResponse<Response<NextKinInfo[]>>> {
    return await adminstrationAxios.get(`/users/getHisNextOfKeens/${userId}`);
  }

  public async getUserByNid(
    nidNumber: string,
  ): Promise<AxiosResponse<Response<BasicPersonInfo>>> {
    return await adminstrationAxios.get(`/users/getPersonByNid/${nidNumber}`);
  }
}

export const userNextKinService = new UserNextKinService();
