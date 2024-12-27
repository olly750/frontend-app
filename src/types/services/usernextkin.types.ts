/* eslint-disable no-unused-vars */
import { Table } from '..';
import { BasicPersonInfo } from './user.types';

export interface NextKinInfo extends Table {
  next_of_keen_proculation_reason: string | null;
  user_id: string;
  next_of_kin: BasicPersonInfo;
  next_of_kin_id: string;
  relation_ship: string;
  residence_id: number;
  residence_name: string;
  userId: string;
}

export interface CreateNextOfKin {
  user_id: string;
  next_of_kins: BasicPersonInfo[];
}

export interface UpdateNextKinInfo {
  person_id: string;
  place_of_residence: string;
  relationship_with_next_of_ken: any;
  residence_location_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: number;
}
