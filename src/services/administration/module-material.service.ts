import { AxiosResponse } from 'axios';
import { Blob } from 'buffer';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  MaterialInfo,
  ModuleMaterial,
  IntakeModuleMaterial,
  ModuleMaterialAttachment,
  IntakeModuleMaterialAttachment,
  ModuleMaterialAttachmentInfo,
  ModuleMaterialInfo,
  UpdateIntakeModuleStatus,
} from './../../types/services/module-material.types';

class ModuleMaterialService {
  public async addModuleMaterial(
    moduleMaterial: ModuleMaterial,
  ): Promise<AxiosResponse<Response<ModuleMaterial>>> {
    return await adminstrationAxios.post(
      '/learningMaterials/addLearningMaterial',
      moduleMaterial,
    );
  }

  public async addIntakeModuleMaterial(
    intakeModuleMaterial: IntakeModuleMaterial,
  ): Promise<AxiosResponse<Response<IntakeModuleMaterial>>> {
    return await adminstrationAxios.post(
      '/learningMaterials/addIntakeProgramLevelLearningMaterial',
      intakeModuleMaterial,
    );
  }


  public async addFile(file: FormData): Promise<AxiosResponse<Response<MaterialInfo>>> {
    return await adminstrationAxios.post('/attachments/addFile', file);
  }
  public async downloadFile(attachmentId: string): Promise<AxiosResponse<Blob>> {
    return await adminstrationAxios.get(`/attachments/download/${attachmentId}`);
  }

  public async getFileById(
    attachmentId: string,
  ): Promise<AxiosResponse<Response<MaterialInfo>>> {
    return await adminstrationAxios.get(`/attachments/getById/${attachmentId}`);
  }

  public async addModuleMaterialAttachment(
    moduleMaterial: ModuleMaterialAttachment,
  ): Promise<AxiosResponse<Response<ModuleMaterialAttachmentInfo>>> {
    return await adminstrationAxios.post(
      '/learningMaterials/addLearningMaterialAttachment',
      moduleMaterial,
    );
  }

  public async addIntakeModuleMaterialAttachment(
    moduleMaterial: IntakeModuleMaterialAttachment,
  ): Promise<AxiosResponse<Response<ModuleMaterialAttachmentInfo>>> {
    return await adminstrationAxios.post(
      '/learningMaterials/addIntakeLearningMaterialAttachment',
      moduleMaterial,
    );
  }


  public async getModuleMaterialAttachments(
    materialId: string,
  ): Promise<AxiosResponse<Response<ModuleMaterialAttachmentInfo[]>>> {
    return await adminstrationAxios.get(
      `learningMaterials/getLearningMaterialsAttachementsByLearningMaterialId/${materialId}`,
    );
  }

  public async getIntakeModuleMaterialAttachments(
    materialId: string,
  ): Promise<AxiosResponse<Response<ModuleMaterialAttachmentInfo[]>>> {
    return await adminstrationAxios.get(
      `learningMaterials/getLearningMaterialsAttachementsByIntakeModuleMaterialId/${materialId}`,
    );
  }

  public async getModuleMaterial(
    id: string,
  ): Promise<AxiosResponse<Response<ModuleMaterialInfo>>> {
    return await adminstrationAxios.get(
      `learningMaterials/getLearningMaterialsById/${id}`,
    );
  }
  
  public async getIntakeModuleMaterial(
    id: string,
  ): Promise<AxiosResponse<Response<ModuleMaterialInfo>>> {
    return await adminstrationAxios.get(
      `learningMaterials/getIntakeAcademicProgramLevelModulesMaterialsById/${id}`,
    );
  }

  
  public async getModuleMaterialByModule(
    moduleId: string,
  ): Promise<AxiosResponse<Response<ModuleMaterialInfo[]>>> {
    return await adminstrationAxios.get(
      `learningMaterials/getLearningMaterialsByModuleId/${moduleId}`,
    );
  }

  public async getIntakeLevelModuleMaterialByIntakeLevelModule(
    moduleId: string,
  ): Promise<AxiosResponse<Response<ModuleMaterialInfo[]>>> {
    return await adminstrationAxios.get(
      `learningMaterials/getIntakeAcademicProgramLevelLearningMaterialsByMintakelevelmdlemoduleId/${moduleId}`,
    );
  }

  // public async changeModuleMaterialAttachmentStatus(data: {
  //   attachmentId: string;
  //   status: string;
  // }): Promise<void> {
  //   return await adminstrationAxios.put(
  //     `/learningMaterials/changeIntakeModuleAttachmentStatus/${data.attachmentId}/${data.status}`,
  //   );
  // }

  public async changeModuleMaterialAttachmentStatus(
    updated: UpdateIntakeModuleStatus,
  ): Promise<AxiosResponse<Response<any>>> {
    return await adminstrationAxios.put(`/learningMaterials/changeIntakeModuleAttachmentStatus`, updated);
  }



}

export const moduleMaterialService = new ModuleMaterialService();
