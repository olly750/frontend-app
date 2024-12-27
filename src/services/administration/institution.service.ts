import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  AddInstitutionLogo,
  BasicInstitutionInfo,
  InstitutionInfo,
} from '../../types/services/institution.types';

class InstitutionService {
  public async create(
    institution: BasicInstitutionInfo,
  ): Promise<AxiosResponse<Response<InstitutionInfo>>> {
    return await adminstrationAxios.post('institutions/addInstitution', institution);
  }

  public async addLogo(
    req: AddInstitutionLogo,
  ): Promise<AxiosResponse<Response<InstitutionInfo>>> {
    return await adminstrationAxios.post(
      `/attachments/addInstitutionLogo/${req.id}`,
      req.info,
    );
  }

  public async fetchAll(): Promise<AxiosResponse<Response<InstitutionInfo[]>>> {
    return await adminstrationAxios.get('/institutions/getInstitutions');
  }

  public async getInstitutionById(
    id: string,
  ): Promise<AxiosResponse<Response<InstitutionInfo>>> {
    return await adminstrationAxios.get(`/institutions/getInstitutionById/${id}`);
  }
  public async update(
    institution: BasicInstitutionInfo,
  ): Promise<AxiosResponse<Response<InstitutionInfo>>> {
    return await adminstrationAxios.put(`/institutions/modifyInstitution`, {
      ...institution,
    });
  }
}

export const institutionService = new InstitutionService();
