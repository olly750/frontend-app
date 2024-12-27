import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { IcreateLevel, ILevel, ProgramLevel } from '../../types/services/levels.types';

class LevelService {
  public async addLevel(level: IcreateLevel): Promise<AxiosResponse<Response<ILevel>>> {
    return await adminstrationAxios.post('/levels/addLevel', level);
  }

  public async getLevels(): Promise<AxiosResponse<Response<ILevel[]>>> {
    return await adminstrationAxios.get('/levels/getLevels');
  }

  public async getLevelsByAcademy(
    id: string,
  ): Promise<AxiosResponse<Response<ILevel[]>>> {
    return await adminstrationAxios.get(`/levels/getLevelsByAcademy/${id}`);
  }

  public async getLevelsByProgram(
    programId: string,
  ): Promise<AxiosResponse<Response<ProgramLevel[]>>> {
    return await adminstrationAxios.get(
      `/programs/getLevelsByAcademicProgram/${programId}`,
    );
  }

  public async getLevelById(id: string): Promise<AxiosResponse<Response<ILevel>>> {
    return await adminstrationAxios.get(`/levels/getLevelById/${id}`);
  }

  public async modifylevel(
    level: IcreateLevel,
  ): Promise<AxiosResponse<Response<ILevel>>> {
    return await adminstrationAxios.put('/levels/modifyLevel', { ...level });
  }
}

export const levelService = new LevelService();
