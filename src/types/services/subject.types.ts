import { Table } from '..';
import { Instructor } from './instructor.types';
import {
  IntakeLevelModule,
  IntakeModuleStatus,
  IntakeProgramLevelPeriodInfo,
} from './intake-program.types';
import { ModuleInfo } from './modules.types';

export interface SubjectInfo {
  content: string;
  module_id: string;
  title: string;
}

export interface AddSubjectData extends Pick<SubjectInfo, 'module_id' | 'title'> {
  description: string;
}

export interface EditSubjectData extends AddSubjectData {
  id: string;
}
export interface ExtendedSubjectInfo extends Table, SubjectInfo {
  evaluation_module_subject_id?: string;
  module: ModuleInfo;
}

export interface SubjectPeriodInfo extends Table {
  actual_end_on: string;
  actual_start_on: string;
  incharge: Instructor;
  intake_academic_year_period: IntakeProgramLevelPeriodInfo;
  intake_program_module_level: IntakeLevelModule;
  marks: string;
  planned_end_on: string;
  planned_start_on: string;
  satus: IntakeModuleStatus;
  subject: ExtendedSubjectInfo;
}
