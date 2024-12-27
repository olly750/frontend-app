import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  CreateModuleInfo,
  CreatePrerequisites,
  ModuleInfo,
  ModulePrerequisites,
} from '../../types/services/modules.types';

type TableId = string | number;

class ModuleService {
  public async create(
    module: CreateModuleInfo,
  ): Promise<AxiosResponse<Response<ModuleInfo>>> {
    return await adminstrationAxios.post('/coursemodules/addModule', module);
  }

  public async fetchAll(): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.get('/coursemodules/getAllModules');
  }

  public async getModuleById(
    id: TableId,
    abortController?: AbortSignal,
  ): Promise<AxiosResponse<Response<ModuleInfo>>> {
    return await adminstrationAxios.get(`/coursemodules/getModuleById/${id}`, {
      signal: abortController,
    });
  }

  public async getModulesByProgram(
    programId: TableId,
  ): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.get(
      `/coursemodules/getModulesByProgram/${programId}`,
    );
  }

  public async getModulePrereqs(
    moduleId: string,
  ): Promise<AxiosResponse<Response<ModulePrerequisites[]>>> {
    return await adminstrationAxios.get(
      `/coursemodules/getModulePrerequisits/${moduleId}`,
    );
  }

  public async getModulesByAcademy(
    academyId: TableId,
  ): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.get(
      `/coursemodules/getModulesByAccademy/${academyId}`,
    );
  }
  public async modifyModule(
    updated: CreateModuleInfo,
  ): Promise<AxiosResponse<Response<ModuleInfo[]>>> {
    return await adminstrationAxios.put(`/coursemodules/modifyModule`, updated);
  }

  public async addPrerequisites(
    prereq: CreatePrerequisites,
  ): Promise<AxiosResponse<Response<ModuleInfo>>> {
    return await adminstrationAxios.post(`/coursemodules/addPrerequisites`, prereq);
  }
}

export const moduleService = new ModuleService();
