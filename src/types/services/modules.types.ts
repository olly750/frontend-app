import { GenericStatus } from '..';
import { Table } from './common.types';
import { EnrollmentStatus } from './enrollment.types';
import { Instructor } from './instructor.types';
import { ModuleParticipation } from './intake-program.types';
import { ProgramInfo } from './program.types';

export interface ModuleInfo extends CreateModuleInfo, Table {
  code: string;
  status: boolean;
  program: ProgramInfo;
  total_num_subjects: number;
}

export interface InstructorModule extends Table {
  academic_year_program_intake_level_id: 2;
  actual_end_on: string;
  actual_start_on: string;
  credits: number;
  incharge: Instructor;
  incharge_id: string;
  intake_level_class_id: string;
  intake_status: EnrollmentStatus;
  last_status_change_reason: string;
  marks: number;
  module: ModuleInfo;
  module_id: string;
  module_participation: ModuleParticipation;
  pass_mark: number;
  planned_end_on: string;
  planned_start_on: string;
  weight: number;
}

export interface CreateModuleInfo {
  id: string | number;
  name: string;
  description: string;
  has_prerequisite: boolean;
  program_id: string;
}

export interface ModuleError extends Pick<CreateModuleInfo, 'name' | 'description'> {}

export interface ModulePrerequisites {
  prerequisite: Prerequisite;
  module: ModuleInfo;
  description: string;
  id: 0;
}

export interface Prerequisite extends Table {
  code: string;
  description: string;
  has_prerequisite: boolean;
  name: string;
  program_id: string;
  status: boolean;
  total_num_subjects: number;
}

export interface CreatePrerequisites {
  modele_id: string;
  prerequistis: {
    description: string;
    module_id: string;
    prerequisite_id: string;
    status: GenericStatus;
  }[];
}
