import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import {
  ChangePassword,
  InitiateResetPassword,
  LoginInfo,
  LoginRes,
  ResetPassword,
  Response,
} from '../../types';
import { AuthUser } from '../../types/services/user.types';

class AuthenticatorService {
  public async login(loginInfo: LoginInfo): Promise<AxiosResponse<Response<LoginRes>>> {
    return await adminstrationAxios.post('/authentication/signin', loginInfo);
  }

  public async authUser(): Promise<AxiosResponse<Response<AuthUser>>> {
    return await adminstrationAxios.get('/authentication/current');
  }
  public async logout() {
    return await adminstrationAxios.get('/authentication/logout');
  }

  public async passwordChange(changePassword: ChangePassword) {
    return await adminstrationAxios.post(
      '/authentication/changePassword',
      changePassword,
    );
  }

  public async resetPassword(userId: string) {
    return await adminstrationAxios.post(`/users/resetPassword/${userId}`);
  }

  public async forgotPassword(initiateResetPassword: InitiateResetPassword) {
    return await adminstrationAxios.post(
      '/authentication/initiatePasswordReset',
      initiateResetPassword,
    );
  }
  public async passwordReset(resetPassword: ResetPassword) {
    return await adminstrationAxios.post('/authentication/resetPassword', resetPassword);
  }
}

export const authenticatorService = new AuthenticatorService();
