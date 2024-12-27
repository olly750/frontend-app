import { FormEvent } from 'react';

/* eslint-disable no-unused-vars */
import { PrivilegeFeatureType, PrivilegeRes } from '..';
import { AcademyInfo } from './academy.types';
import { GenericStatus, Table } from './common.types';
import { InstitutionInfo } from './institution.types';
import { UserInfo } from './user.types';

export interface CreateRoleReq {
  description?: string;
  name?: string;
  academy_id?: string;
  institution_id?: string;
  type: RoleType;
}

export interface RoleRes extends Table {
  description: string;
  name: string;
  academyId: string;
  status: GenericStatus;
  academy_id: string;
  institution_id: string;
  type: RoleType;
}

export interface RoleUsers extends Table {
  role: RoleResWithPrevilages;
  user: UserInfo;
  description: string;
  roleId: string;
  userId: string;
}

export enum RoleApplyOn {
  ACADEMY = 'ACADEMY',
  INSTITUTION = 'INSTITUTION',
}

export interface RoleResWithPrevilages extends RoleRes {
  role_privileges: PrivilegeRes[];
  academy?: AcademyInfo;
  institution?: InstitutionInfo;
}

export interface RolePrivilege extends Table {
  status: string;
  assigned_on: string;
  role_id: string;
  privilege_id: string;
  role: RoleRes;
  privilege: PrivilegeRes;
}

export interface AddRolePrivilege {
  roleId: string;
  roleType: PrivilegeFeatureType;
  privileges: string[];
}

export interface AddPrivilegeReq {
  roleId: string;
  privileges: string;
}

export interface RolePropType {
  onSubmit: <E>(_e?: FormEvent<E>) => void;
  roleName: string;
  roleId: string;
  academyId: string;
}

export interface PresetRolePropType {
  onSubmit: <E>(_e?: FormEvent<E>) => void;
  role?: RoleRes;
}

export enum RoleType {
  ACADEMY = 'ACADEMY',
  INSTITUTION = 'INSTITUTION',
}
