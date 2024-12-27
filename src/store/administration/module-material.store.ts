import { useMutation, useQuery } from 'react-query';

import { moduleMaterialService } from '../../services/administration/module-material.service';

class ModuleMaterialStore {
  addModuleMaterial() {
    return useMutation(moduleMaterialService.addModuleMaterial);
  }

  addIntakeModuleMaterial() {
    return useMutation(moduleMaterialService.addIntakeModuleMaterial);
  }


  addFile() {
    return useMutation(moduleMaterialService.addFile);
  }

  downloadFile(materialId: string, enabled = true) {
    return useQuery(
      ['download/material', materialId],
      () => moduleMaterialService.downloadFile(materialId),
      { enabled },
    );
  }
  getFileById(materialId: string) {
    return useQuery(['attachment/id', materialId], () =>
      moduleMaterialService.getFileById(materialId),
    );
  }
  addModuleMaterialAttachment() {
    return useMutation(moduleMaterialService.addModuleMaterialAttachment);
  }

  addIntakeModuleMaterialAttachment() {
    return useMutation(moduleMaterialService.addIntakeModuleMaterialAttachment);
  }


  getModuleMaterial(id: string) {
    return useQuery(['material/id', id], () =>
      moduleMaterialService.getModuleMaterial(id),
    );
  }

  getIntakeModuleMaterial(id: string) {
    return useQuery(['material/id', id], () =>
      moduleMaterialService.getIntakeModuleMaterial(id),
    );
  }


  getModuleMaterialAttachments(materialId: string) {
    return useQuery(['material/attachment', materialId], () =>
      moduleMaterialService.getModuleMaterialAttachments(materialId),
    );
  }


  getIntakeModuleMaterialAttachments(materialId: string) {
    return useQuery(['material/attachment', materialId], () =>
      moduleMaterialService.getIntakeModuleMaterialAttachments(materialId),
    );
  }

  changeModuleMaterialAttachmentStatus() {
     return useMutation(moduleMaterialService.changeModuleMaterialAttachmentStatus);
  }

  getModuleMaterialByModule(moduleId: string) {
    return useQuery(['material/moduleid', moduleId], () =>
      moduleMaterialService.getModuleMaterialByModule(moduleId),
    );
  }

  // getIntakeAcademicProgramLevelLearningMaterialsByMintakelevelmdlemoduleId
  getIntakeLevelModuleMaterialByIntakeLevelModule(moduleId: string) {
    return useQuery(['material/moduleid', moduleId], () =>
      moduleMaterialService.getIntakeLevelModuleMaterialByIntakeLevelModule(moduleId),
    );
  }

}

export const moduleMaterialStore = new ModuleMaterialStore();
