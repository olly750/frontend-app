import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { AttachementInfo } from '../../types/services/attachement.types';
import { MaterialInfo } from '../../types/services/module-material.types';

class AttachmentService {
  public async addAttachment(
    attachement: AttachementInfo,
  ): Promise<AxiosResponse<MaterialInfo>> {
    return await adminstrationAxios.post('/attachements/addFile', attachement);
  }

  public async getAttachementFile(
    fileName: string,
  ): Promise<AxiosResponse<AttachementInfo>> {
    return await adminstrationAxios.get(`/attachments/download/logos/${fileName}`);
  }

  public async getAttachementById(id: string): Promise<AxiosResponse<AttachementInfo>> {
    return await adminstrationAxios.get(`/attachements/getById/${id}`);
  }

  public async deleteAttachementById(
    id: string,
  ): Promise<AxiosResponse<AttachementInfo>> {
    return await adminstrationAxios.delete(`/attachments/deleteProgramSyllabus/${id}`);
  }
}

export const attachmentService = new AttachmentService();
