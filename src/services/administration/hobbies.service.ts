import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { HobbiesTypes, HobbyRes } from '../../types/services/hobbies.types';

class HobbyService {
  public async addHobby(hobby: HobbiesTypes): Promise<AxiosResponse<Response<HobbyRes>>> {
    return await adminstrationAxios.post('/hobbies/addHobby', hobby);
  }

  public async getHobbies(): Promise<AxiosResponse<Response<HobbyRes[]>>> {
    return await adminstrationAxios.get('/hobbies/getHobbies');
  }

  public async getHobby(id: string): Promise<AxiosResponse<Response<HobbyRes>>> {
    return await adminstrationAxios.get(`/hobbies/getHobbyById/${id}`);
  }

  public async UpdateHobby(
    hobby: HobbiesTypes,
  ): Promise<AxiosResponse<Response<HobbyRes>>> {
    return await adminstrationAxios.put('/hobbies/modifyHobby ', { ...hobby });
  }

  public async getUserHobbies(
    personId: string,
  ): Promise<AxiosResponse<Response<HobbyRes[]>>> {
    return await adminstrationAxios.get(`/hobbies/getPersonHobbies/${personId}`);
  }
}

export const hobbyService = new HobbyService();
