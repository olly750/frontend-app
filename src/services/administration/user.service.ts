import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { FilterOptions, Response, SortedContent } from '../../types';
import { AddInstitutionLogo } from '../../types/services/institution.types';
import {
  AssignUserRole,
  CreateUserInfo,
  EditUser,
  FileAttachment,
  IImportUserRes,
  PersonalDocs,
  UserInfo,
  UserRole,
  UserType,
} from '../../types/services/user.types';
import { formatQueryParameters } from '../../utils/query';
import { UpdateUserInfo } from './../../types/services/user.types';

class UserService {
  public async createUser(
    userInfo: CreateUserInfo,
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.post('/users/registerNewUser', userInfo);
  }

  public async importUsers(
    userInfo: FormData,
  ): Promise<AxiosResponse<Response<IImportUserRes>>> {
    return await adminstrationAxios.post('/users/importUsers', userInfo);
  }

  public async modifyUser(
    userInfo: EditUser,
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.put('/users/modifyUser', userInfo);
  }

  public async assignRole(
    role: AssignUserRole[],
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.put('/users/addRoles', role);
  }

  public async changeUserStatus(
    genericStatus: AssignUserRole[],
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.put('/users/changeUserStatus', genericStatus);
  }



  public async assignRoles(
    role: AssignUserRole[],
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.put('/users/addRoles', role);
  }

  public async revokeRole(
    userRoleId: number,
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.delete(`/users/removeRole/${userRoleId}`);
  }

  public async updateProfile(
    userInfo: UpdateUserInfo,
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.put('/users/updateProfile', userInfo);
  }
  public async addPersonalDoc(
    data: FileAttachment,
  ): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.post(
      `/attachments/addPersonalDocs/${data.id}`,
      data.docInfo,
    );
  }

  public async deletePersonalDoc(id: string): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.delete(`/attachments/deletePersonalDoc/${id}`);
  }
  public async fetchUsers(
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<UserInfo[]>>>> {
    return await adminstrationAxios.get(
      `/users/getUsers?${formatQueryParameters(queryParams)}`,
    );
  }
  public async getUserByid(id: string): Promise<AxiosResponse<Response<UserInfo>>> {
    return await adminstrationAxios.get(`/users/getUserById/${id}`);
  }
  public async getAllBySearch(
    text: string,
  ): Promise<AxiosResponse<Response<SortedContent<UserInfo[]>>>> {
    return await adminstrationAxios.get(`/users/getAllBySearch?q=${text}&pageSize=100`);
  }
  public async getUsersByInstitution(
    institutionId: string,
  ): Promise<AxiosResponse<Response<UserInfo[]>>> {
    return await adminstrationAxios.get(`users/getUsersByInstitution/${institutionId}`);
  }
  public async getUsersByAcademy(
    academyId: string,
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<UserInfo[]>>>> {
    return await adminstrationAxios.get(
      `users/getUsersByAcademy/${academyId}?${formatQueryParameters(queryParams)}`,
    );
  }
  public async getUsersByAcademyAndUserType(
    academyId: string,
    userType: UserType,
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<UserInfo[]>>>> {
    return await adminstrationAxios.get(
      `/users/getUsersByAcademyAndType/${academyId}/${userType}?${formatQueryParameters(
        queryParams,
      )}`,
    );
  }

  public async getUsersOrderedByRank(
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<UserInfo[]>>>> {
    return await adminstrationAxios.get(
      `/users/getUsersOrderedByRank?${formatQueryParameters(queryParams)}`,
    );
  }

  public async getUserAccountByNid(
    nid: string,
  ): Promise<AxiosResponse<Response<UserInfo[]>>> {
    return await adminstrationAxios.get(`/public/getUserAccountsByNid/${nid}`);
  }

  public async getAssignedRoles(
    userId: string,
  ): Promise<AxiosResponse<Response<UserRole[]>>> {
    return await adminstrationAxios.get(`/users/getAssignedRoles/${userId}`);
  }

  public async getLanguages() {
    return await adminstrationAxios.get('languages/getLanguages');
  }

  public async addProfile(req: AddInstitutionLogo): Promise<AxiosResponse<UserInfo>> {
    return await adminstrationAxios.post(
      `attachments/addUserProfileImage/${req.id}`,
      req.info,
    );
  }
  public async downloadProfile(attachmentId: string): Promise<AxiosResponse<Blob>> {
    return await adminstrationAxios.get(`attachments/download/profile/${attachmentId}`);
  }

  public async getUserFiles(
    personId: string,
  ): Promise<AxiosResponse<Response<PersonalDocs[]>>> {
    return await adminstrationAxios.get(`attachments/getAllPersonalDocs/${personId}`);
  }
}

export const userService = new UserService();
