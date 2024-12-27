import { Table } from './common.types';
/* eslint-disable no-unused-vars */
export interface ModuleMaterial {
  content: string;
  module_id: string;
  title: string;
  type: MaterialType;
}

export interface IntakeModuleMaterial {
  content: string;
  intakelevelmdlemodule_id:  string;
  module_id: string;
  title: string;
  type: MaterialType;
}
export interface UpdateIntakeModuleStatus {
  intake_module_material_attachment_id: File;
  status: string;
}

export interface ModuleMaterialInfo extends Table, ModuleMaterial {}

export interface MaterialInfo extends Table {
  original_file_name: string;
  description: string;
  purpose: string;
  file_type: string;
  content_format: string;
  path_to_file: string;
}

export interface ModuleMaterialAttachment {
  attachment_id: string;
  learning_material_id: number;
}

export interface IntakeModuleMaterialAttachment {
  attachment_id: string;
  intake_academic_program_level_module_materials_id: number;
}

export interface ModuleMaterialAttachmentInfo extends Table, ModuleMaterialAttachment {
  learning_material: ModuleMaterial;
  intake_module_attachment_status: string;
}

export enum MaterialType {
  NOTES = 'NOTES',
  EXAMS = 'EXAMS',
  WORKSHOP = 'WORKSHOP',
  SEMINARIES = 'SEMINARIES',
}
