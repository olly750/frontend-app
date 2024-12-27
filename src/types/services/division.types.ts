/* eslint-disable no-unused-vars */
import { GenericStatus, Table } from '..';
import { AcademyInfo } from './academy.types';
import { ProgramInfo } from './program.types';

export interface DivisionInfo extends Table, DivisionCreateInfo {
  academy: AcademyInfo;
  departments: [];
  programs: ProgramInfo;
  total_num_childreen: number;
  total_num_of_programs: number;
  parent: DivisionInfo;
}

export interface DivisionCreateInfo {
  id: string | number;
  academy_id: string;
  code: string;
  description: string;
  division_type: string;
  name: string;
  parent_id?: string;
  academy?: AcademyInfo;
}

export interface FacultyErrors extends Pick<DivisionCreateInfo, 'name' | 'description'> {}
export interface DepartErrors extends Pick<DivisionCreateInfo, 'name' | 'description'> {
  faculty: string;
}

export enum Status {
  ACTIVE,
  INACTIVE,
  DELETED,
  RESET,
}
