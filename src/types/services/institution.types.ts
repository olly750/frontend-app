/* eslint-disable no-unused-vars */
import { keyString, Table } from '..';
import { AcademyInfo } from './academy.types';
import { GenericStatus } from './common.types';
import { LocationInfo } from './location.types';

export interface BasicInstitutionInfo {
  current_admin_id: string;
  email: string;
  fax_number: string;
  full_address: string;
  generic_status: GenericStatus;
  mission: string;
  moto: string;
  name: string;
  phone_number: string;
  postal_code: string;
  short_name: string;
  website_link: string;
  head_office_location_id?: number;
  id: number | string;
  theme: IInstitutionTheme | null;
}

export interface InstitutionInfo extends Table, BasicInstitutionInfo {
  academies: AcademyInfo[];
  villages: LocationInfo;
  village_id: string;

  logo_attachment_file_name: string | null;
  logo_attachment_id: string | null;
}

export interface AddInstitutionLogo {
  id: string;
  info: FormData;
}

export enum IInstitutionTheme {
  NISS_GREEN = 'NISS_GREEN',
  MILITARY_GREEN = 'MILITARY_GREEN',
  POLICE_DARK_BLUE = 'POLICE_DARK_BLUE',
  RCS_TAN = 'RCS_TAN',
  DEFAULT = 'DEFAULT',
}

export const themeConfig: keyString = {
  MILITARY_GREEN: 'MILITARY-theme',
  POLICE_DARK_BLUE: 'RNP-theme',
  RCS_TAN: 'RCS-theme',
  NISS_GREEN: 'NISS-theme',
  DEFAULT: 'DEFAULT-theme',
};
