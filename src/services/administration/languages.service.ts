import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types/services/common.types';
import { LanguageRes, LanguageTypes } from '../../types/services/language.types';

class LanguageService {
  public async addLanguage(
    language: LanguageTypes,
  ): Promise<AxiosResponse<Response<LanguageRes>>> {
    return await adminstrationAxios.post('/languages/addLanguage', language);
  }

  public async getAllLanguages(): Promise<AxiosResponse<Response<LanguageRes[]>>> {
    return await adminstrationAxios.get('/languages/getLanguages');
  }

  public async getLanguage(id: string): Promise<AxiosResponse<Response<LanguageRes>>> {
    return await adminstrationAxios.get(`/languages/getLanguageById/${id}`);
  }

  public async getLanguageByPerson(
    personId: string,
  ): Promise<AxiosResponse<Response<LanguageRes[]>>> {
    return await adminstrationAxios.get(`languages/getLanguageByPersonId/${personId}`);
  }

  public async modifyLanguage(
    language: LanguageTypes,
  ): Promise<AxiosResponse<Response<LanguageRes>>> {
    return await adminstrationAxios.put('/languages/modifyLanguage', { ...language });
  }
}

export const languageService = new LanguageService();
