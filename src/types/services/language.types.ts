import { Table } from '..';

export interface LanguageTypes {
  description: string;
  name: string;
  person_id: string;
  code: string;
  origin: string;
}

export interface LanguageRes extends LanguageTypes, Table {}

export enum langCode {
  RW = 'RW',
  EN = 'EN',
  FR = 'FR',
  GEN = 'GEN',
  NA = 'NA',
}
