import { AxiosResponse } from 'axios';
import { Blob } from 'buffer';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { ExperienceInfo, Experiences } from './../../types/services/experience.types';

class ExperienceService {
  public async create(
    experience: ExperienceInfo,
  ): Promise<AxiosResponse<Response<ExperienceInfo>>> {
    return await adminstrationAxios.post('/experiences/addExperience', experience);
  }

  public async addFile(file: FormData): Promise<AxiosResponse<Response<Experiences>>> {
    return await adminstrationAxios.post('/attachments/addFile', file);
  }
  public async downloadFile(attachmentId: string): Promise<AxiosResponse<Blob>> {
    return await adminstrationAxios.get(`/attachments/download/${attachmentId}`);
  }

  public async fetchAll(): Promise<AxiosResponse<Response<Experiences[]>>> {
    return await adminstrationAxios.get('/experiences/getExperiences');
  }

  public async getExperienceById(
    id: string,
  ): Promise<AxiosResponse<Response<Experiences>>> {
    return await adminstrationAxios.get(`/experiences/getExperienceById/${id}`);
  }
  public async update(
    experience: ExperienceInfo,
  ): Promise<AxiosResponse<Response<ExperienceInfo>>> {
    return await adminstrationAxios.put(`/experiences/modifyExperience`, {
      ...experience,
    });
  }
  public async findPersonExperiences(
    personId: string,
  ): Promise<AxiosResponse<Response<Experiences[]>>> {
    return await adminstrationAxios.get(`/experiences/findPersonExperiences/${personId}`);
  }
}

export const experienceService = new ExperienceService();
