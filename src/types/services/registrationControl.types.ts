import { Table } from '..';
import { AcademyCreateInfo, AcademyInfo } from './academy.types';

export interface IRegistrationControlCreateInfo {
  academy_id: string;
  academic_year_id: string;
  description: string;
  expected_end_date: string;
  expected_start_date: string;
  academy?: AcademyInfo;
}

export interface RegErrors
  extends Pick<
    IRegistrationControlCreateInfo,
    'description' | 'expected_start_date' | 'expected_end_date' | 'academic_year_id'
  > {}
export interface IRegistrationControlUpdateInfo extends IRegistrationControlCreateInfo {
  id: string;
}

export interface IRegistrationControlInfo
  extends IRegistrationControlCreateInfo,
    Table,
    AcademyCreateInfo {
  academy: AcademyInfo;
}
