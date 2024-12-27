import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import {
  DiseaseRes,
  DiseasesTypes,
  PersonDiseaseRes,
  PersonDiseaseTypes,
} from '../../types/services/chronicdiseases.types';
import { Response } from '../../types/services/common.types';

class DiseasesService {
  public async addDisease(
    disease: DiseasesTypes,
  ): Promise<AxiosResponse<Response<DiseaseRes>>> {
    return await adminstrationAxios.post('/diseases/createChronicalDisease', disease);
  }

  public async addChronicalDiseasesToPerson(
    disease: PersonDiseaseTypes,
  ): Promise<AxiosResponse<Response<DiseaseRes>>> {
    return await adminstrationAxios.post(
      '/diseases/addChronicalDiseasesToPerson',
      disease,
    );
  }

  public async getAllDiseases(): Promise<AxiosResponse<Response<DiseaseRes[]>>> {
    return await adminstrationAxios.get('diseases/getChronicalDiseases');
  }

  public async getPersonDiseases(
    personId: string,
  ): Promise<AxiosResponse<Response<PersonDiseaseRes[]>>> {
    return await adminstrationAxios.get(`diseases/getDiseasesByPerson/${personId}`);
  }

  public async getDisease(id: string): Promise<AxiosResponse<Response<DiseaseRes>>> {
    return await adminstrationAxios.get(`/diseases/getDisease/${id}`);
  }

  public async ModifyDisease(
    disease: DiseasesTypes,
  ): Promise<AxiosResponse<Response<DiseaseRes>>> {
    return await adminstrationAxios.put('/diseases/modifyChronicalDisease', {
      ...disease,
    });
  }

  public async getUserDisease(
    personId: string,
  ): Promise<AxiosResponse<Response<DiseaseRes[]>>> {
    return await adminstrationAxios.get(`/diseases/getUserDisease/${personId}`);
  }
  public async removeDisease(diseaseId: string): Promise<AxiosResponse<Response<{}>>> {
    return await adminstrationAxios.delete(
      `/diseases/removeDiseasesFromPerson/${diseaseId}`,
    );
  }
}

export const diseaseService = new DiseasesService();
