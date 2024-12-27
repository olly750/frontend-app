/* eslint-disable no-unused-vars */
import { Table } from '..';
import { IAcademicYearInfo } from './academicyears.types';
import { PeriodType } from './intake.types';

export interface IAcademicPeriodInfo extends Table {
  name: string;
  academic_year: IAcademicYearInfo;
  period_type: PeriodType;
  start_on: string;
  end_on: string;
  academic_year_id: string;
}

export enum IAcademicPeriodStatus {
  INITIAL = 'INITIAL',
  STARTED = 'STARTED',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

export interface ICreateAcademicPeriod {
  academic_year_id: string;
  end_on: string;
  id: string;
  name: string;
  period_type: PeriodType;
  start_on: string;
}
