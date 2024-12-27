import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { AddInstitutionLogo } from '../../types/services/institution.types';
import { AcademyCreateInfo, AcademyInfo } from './../../types/services/academy.types';

class AcademyService {
  public async createAcademy(
    academyInfo: AcademyCreateInfo,
  ): Promise<AxiosResponse<Response<AcademyInfo>>> {
    return await adminstrationAxios.post('/academies/addAcademy', academyInfo);
  }

  public async addAcademyLogo(
    req: AddInstitutionLogo,
  ): Promise<AxiosResponse<Response<AcademyInfo>>> {
    return await adminstrationAxios.post(
      `/attachments/addAcademyLogo/${req.id}`,
      req.info,
    );
  }

  public async fetchAcademies(): Promise<AxiosResponse<Response<AcademyInfo[]>>> {
    return await adminstrationAxios.get('/academies/getAcademies');
  }
  public async getAcademiesByInstitution(
    institutionId: string,
  ): Promise<AxiosResponse<Response<AcademyInfo[]>>> {
    return await adminstrationAxios.get(
      `/academies/getAcademiesByInstitution/${institutionId}`,
    );
  }
  public async getAcademyById(id: string): Promise<AxiosResponse<Response<AcademyInfo>>> {
    return await adminstrationAxios.get(`/academies/getAcademyById/${id}`);
  }

  public async modifyAcademy(
    academyInfo: AcademyCreateInfo,
  ): Promise<AxiosResponse<Response<AcademyInfo>>> {
    return await adminstrationAxios.put('/academies/modifyAcademy', { ...academyInfo });
  }
}

export const academyService = new AcademyService();
