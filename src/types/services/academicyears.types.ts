/* eslint-disable no-unused-vars */
import { Table } from '..';
import { AcademyInfo } from './academy.types';

export interface IAcademicYearInfo extends Table {
  name: string;
  actual_atart_on: string;
  actual_end_on: null;
  planned_start_on: string;
  planned_end_on: string;
  academy: AcademyInfo;
  academyId: string;
  status: IAcademicYearStatus;
}

export enum IAcademicYearStatus {
  INITIAL = 'INITIAL',
  STARTED = 'STARTED',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

export interface ICreateAcademicYear {
  academyId: string;
  actualAtartOn: string;
  actualEndOn: string;
  id: string | number;
  name: string;
  plannedEndOn: string;
  plannedStartOn: string;
  status: IAcademicYearStatus;
}

export interface AcademicYearErrors
  extends Pick<ICreateAcademicYear, 'plannedStartOn' | 'plannedEndOn'> {}
