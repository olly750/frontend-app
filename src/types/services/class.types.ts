/* eslint-disable no-unused-vars */
import { GenericStatus } from '..';
import { AcademyInfo } from './academy.types';
import { Table } from './common.types';
import { InstitutionInfo } from './institution.types';
import { Instructor } from './instructor.types';
import { IntakeProgramLevelPeriodInfo, LevelIntakeProgram } from './intake-program.types';
import { Student } from './user.types';

export interface ICreateClass {
  class_group_type: ClassGroupType;
  class_name: string;
  class_representative_one_id: string;
  class_representative_tree_id: string;
  class_representative_two_id: string;
  instructor_class_in_charge_id: string;
  instructor_class_in_charge_two_id: string;
  instructor_class_in_charge_three_id: string;
  intake_academic_year_period_id: number;
  intake_level_id: number;
}

export interface IStudent {
  reg_number: string;
  academy: AcademyInfo;
  academyId: string;
  admin_id: string;
  id: string;
  institution: InstitutionInfo;
  institutionId: 'string';
  passwordResetPeriodInDays: 0;
  status: GenericStatus;
  username: 'string';
}

export interface IClassStudent {
  intake_level_class_id: number;
  students_id: string;
}

export interface StudentsInClass extends Table {
  student: Student;
  intake_level_class: IClass;
}

export interface IClass extends Table {
  academic_year_program_intake_level: LevelIntakeProgram;
  intake_academic_year_period: IntakeProgramLevelPeriodInfo;
  class_representative_one_id: string;
  class_representative_two_id: string;
  class_representative_tree_id: string;
  instructor_class_incharge_id: string;
  instructor_class_incharge_name: string;
  class_group_type: ClassGroupType;
  class_name: string;
  instructor_class_incharge_three_id: string;
  instructor_class_incharge_two_id: string;
  intake_academic_year_period_id: number;
}

export type IStudentClass = {
  classObject: IClass;
};

export enum ClassGroupType {
  CLASS = 'CLASS',
  SYNDICATE = 'SYNDICATE',
  PARTON = 'PARTON',
  COMPANY = 'COMPANY',
  LANE = 'LANE',
  SECTION = 'SECTION',
  OTHERS = 'OTHERS',
}
