import { Instructor } from '../types/services/instructor.types';
import { StudentTypes, UserInfo, UserTypes } from '../types/services/user.types';
import { Student } from './../types/services/user.types';
import moment from 'moment';

export function formatUserTable(data: UserInfo[]): UserTypes[] {
  return data.map((d) => ({
    id: d.id.toString(),
    rank: d.person?.current_rank?.name,
    username: d.username,
    'full name': d.first_name + ' ' + d.last_name,
    email: d.email,
    'ID Card': d.person && d.person.nid,
    academy: d.academy && d.academy.name,
    status: d.generic_status,
    user_type: d.user_type,
  })) as UserTypes[];
}

export function formatInstructorTable(data: Instructor[]): UserTypes[] {
  return data.map((d) => ({
    id: d.user.id.toString(),
    rank: d.user.person?.current_rank?.name,
    username: d.user.username,
    'full name': d.user.first_name + ' ' + d.user.last_name,
    email: d.user.email,
    'ID Card': d.user.person && d.user.person.nid,
    // academy: d.academy && d.academy.name,
    status: d.user.generic_status,
    user_type: d.user.user_type,
  })) as UserTypes[];
}

export function formatStudentTable(data: Student[]): StudentTypes[] {
  const currentDate = new Date();
  const convCurrentDate : any =`${moment(currentDate).format('YYYY-MM-DD  HH:mm:ss')}`;
 
  return data.map((d) => ({
    id: d.user.id.toString(),
    rank: d.user.person?.current_rank?.name,
    username: d.user.username,
    reg_number: d.reg_number,
    'full name': d.user.first_name + ' ' + d.user.last_name,
    email: d.user.email,
    'ID Card': d.user.person && d.user.person.nid,
    // academy: d.user.academy && d.user.academy.name,
    status: d.user.generic_status,
    user_type: d.user.user_type,
  })) as StudentTypes[];
}

export function arrayEquals(arr1: any[], arr2: any[]) {
  if (!arr2) return false;

  // compare lengths - can save a lot of time
  if (arr1.length != arr2.length) return false;

  for (var i = 0, l = arr1.length; i < l; i++) {
    // Check if we have nested arrays
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arrayEquals(arr1[i], arr2[i])) return false;
    } else if (arr1[i] != arr2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
