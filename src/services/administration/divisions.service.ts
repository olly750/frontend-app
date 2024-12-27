import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { DivisionCreateInfo, DivisionInfo } from '../../types/services/division.types';

class DivisionService {
  public async addDivision(
    division: DivisionCreateInfo,
  ): Promise<AxiosResponse<Response<DivisionInfo>>> {
    return await adminstrationAxios.post('/divisions/addDivision', division);
  }

  public async getDivision(
    type: string,
  ): Promise<AxiosResponse<Response<DivisionInfo[]>>> {
    return await adminstrationAxios.get(`/divisions/getDivisionsByType/${type}`);
  }

  public async getDivisionById(
    id: string,
  ): Promise<AxiosResponse<Response<DivisionInfo>>> {
    return await adminstrationAxios.get(`/divisions/getDivisionById/${id}`);
  }
  public async getDivisionsByAcademy(
    divisionType: string,
    academyId: string,
  ): Promise<AxiosResponse<Response<DivisionInfo[]>>> {
    return await adminstrationAxios.get(
      `divisions/getDivisionsByTypeAndAcademy/${divisionType}/${academyId}`,
    );
  }

  public async getFacultyByDepartment(
    id: string,
  ): Promise<AxiosResponse<Response<DivisionInfo[]>>> {
    return await adminstrationAxios.get(`/divisions/getDivisionsByParent/${id}`);
  }

  public async modifyDivision(
    division: DivisionCreateInfo,
  ): Promise<AxiosResponse<Response<DivisionInfo>>> {
    return await adminstrationAxios.put('/divisions/modifyDivision', { ...division });
  }
}

export const divisionService = new DivisionService();
