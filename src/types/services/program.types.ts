/* eslint-disable no-unused-vars */
import { Table } from '..';
import { DivisionInfo } from './division.types';
import { Instructor } from './instructor.types';
import { ILevel } from './levels.types';
export interface ProgramInfo extends CreateProgramInfo, Table {
  department: DivisionInfo;
  current_admin_names: string;
  total_num_modules: number;
  current_admin_id: string;
}
export interface ProgramFile {
  attachment_file_name: string;
  attachment_id: string;
}

export interface CreateProgramInfo {
  code: string;
  in_charge_id: string;
  department_id: string;
  description: string;
  name: string;
  type: ProgramType;
  status: ProgramStatus;
}

export interface UpdateProgramInfo {
  code: string;
  in_charge_id: string;
  department_id: string;
  description: string;
  name: string;
  id: string | number;
  type: ProgramType;
  status: ProgramStatus;
}

export interface ProgramErrors
  extends Pick<UpdateProgramInfo, 'name' | 'code' | 'in_charge_id' | 'description'> {}

export interface CreateAcademicProgramLevel {
  endg_flow: number;
  level_id?: number;
  program_id: string;
  useSingleLevel: false;
  starting_flow: number;
}

export interface AcademicProgramLevel extends CreateAcademicProgramLevel, Table {
  level: ILevel;
  program: ProgramInfo;
}

export enum ProgramStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ProgramType {
  SHORT_COURSE = 'SHORT_COURSE',
  ACADEMIC = 'ACADEMIC',
}
export interface ProgramSyllabus {
  description: string;
  purpose: string;
  programId: string;
}
