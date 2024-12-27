import { Table } from '..';

export interface CreateRankReq {
  name?: string;
  description?: string;
  abbreviation: string;
  category?: RankCategory;
  institution_id?: string;
  priority: number;
}
export interface RankErrors
  extends Pick<CreateRankReq, 'name' | 'description' | 'abbreviation'> {
  priority: string;
}

export interface UpdateRankReq extends CreateRankReq {
  id: string;
}

export interface RankRes extends CreateRankReq, Table {}

export enum RankCategory {
  G_OFFICERS = 'G_OFFICERS',
  SENIOR_COMMANDS = 'SENIOR_COMMANDS',
  GENERALS = 'GENERALS',
  MEN = 'MEN',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}
