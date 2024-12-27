import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  AddSubjectData,
  EditSubjectData,
  ExtendedSubjectInfo,
} from '../../types/services/subject.types';

class SubjectService {
  public async addSubject(
    subject: AddSubjectData,
  ): Promise<AxiosResponse<Response<ExtendedSubjectInfo>>> {
    return await adminstrationAxios.post('/subjects/addSubject', subject);
  }

  public async getSubjects(): Promise<AxiosResponse<Response<ExtendedSubjectInfo[]>>> {
    return await adminstrationAxios.get('/subjects/getAllSubjects');
  }

  public async getSubject(
    id: string,
  ): Promise<AxiosResponse<Response<ExtendedSubjectInfo>>> {
    return await adminstrationAxios.get(`/subjects/getSubjectById/${id}`);
  }

  public async getSubjectsByModule(
    moduleId: string,
  ): Promise<AxiosResponse<Response<ExtendedSubjectInfo[]>>> {
    if (!moduleId || moduleId === '' || moduleId === 'undefined')
      return new Promise(() => {});

    return await adminstrationAxios.get(`/subjects/getSubjectsByModule/${moduleId}`);
  }

  public async modifySubject(
    subject: EditSubjectData,
  ): Promise<AxiosResponse<Response<ExtendedSubjectInfo>>> {
    return await adminstrationAxios.put('/subjects/modifySubject', subject);
  }
}

export const subjectService = new SubjectService();
