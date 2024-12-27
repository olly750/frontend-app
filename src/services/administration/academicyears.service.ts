import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  IAcademicYearInfo,
  ICreateAcademicYear,
} from '../../types/services/academicyears.types';

class AcademicYearService {
  public async createAcademicYear(
    academicYearInfo: ICreateAcademicYear,
  ): Promise<AxiosResponse<Response<IAcademicYearInfo>>> {
    return await adminstrationAxios.post('/yers/addAcademicYear', academicYearInfo);
  }
  public async fetchAcademicYears(
    academyId: string,
  ): Promise<AxiosResponse<Response<IAcademicYearInfo[]>>> {
    return await adminstrationAxios.get(`/yers/getAcademicYearsByAcademy/${academyId}`);
  }

  public async getAcademicYearById(
    id: string,
  ): Promise<AxiosResponse<Response<IAcademicYearInfo>>> {
    return await adminstrationAxios.get(`yers/getAcademicYearById/${id}`);
  }

  public async modifyAcademicYear(
    yearInfo: ICreateAcademicYear,
  ): Promise<AxiosResponse<Response<IAcademicYearInfo>>> {
    return await adminstrationAxios.put('/yers/modifyAcademicYear', { ...yearInfo });
  }
}

export const academicyearsService = new AcademicYearService();
