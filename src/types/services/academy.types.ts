import { Table } from '..';
import { InstitutionInfo } from './institution.types';
import { LocationInfo } from './location.types';

export interface AcademyInfo extends AcademyCreateInfo, Table {
  id: string;
  institution: InstitutionInfo;
  village: LocationInfo;
  post_code: string;
  village_id: string;
  total_num_students: number;
  total_num_instructors: number;
  total_num_programs: number;
  total_num_faculties: number;
  total_num_departments: number;

  logo_attachment_id: string | undefined;
  logo_attachment_file_name: string | null;
}

export interface AcademyCreateInfo {
  //   academic_years	[...]
  // divisions	[...]
  // instructors	[...]
  // registration_periods	[...]
  // students	[...]
  // users:	[...]
  current_admin_id: string;
  email: string;
  fax_number: string;
  full_address: string;
  head_office_location_id: number;
  institution_id: string;
  mission: string;
  moto: string;
  name: string;
  phone_number: string;
  postal_code: string;
  short_name: string;
  website_link: string;
  translation_preset: string;
}

export interface AcademyInfoErrors
  extends Pick<
    AcademyCreateInfo,
    'name' | 'moto' | 'mission' | 'short_name' | 'translation_preset'
  > {}

export interface AcademyLocationErrors
  extends Pick<
    AcademyCreateInfo,
    'email' | 'phone_number' | 'fax_number' | 'website_link' | 'full_address'
  > {
  head_office_location_id: string;
}
