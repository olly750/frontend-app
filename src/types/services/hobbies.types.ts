import { Table } from '..';

export interface HobbiesTypes {
  description: string;
  name: string;
  person_id: string;
}

export interface HobbyRes extends HobbiesTypes, Table {}
