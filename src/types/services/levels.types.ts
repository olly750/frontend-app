import { Table } from '..';
import { ProgramInfo } from './program.types';

export interface IcreateLevel {
  id: number | string;
  academy_id: string;
  code: string;
  description: string;
  name: string;
  flow: number;
}

export interface LevelErrors extends Pick<IcreateLevel, 'name' | 'description'> {
  flow: string;
}

export interface ILevel extends Table, IcreateLevel {
  lastStatusChangeReason: string;
  flow: number;
}

export interface ProgramLevel extends Table {
  level: ILevel;
  program: ProgramInfo;
  level_id: string;
  program_id: string;
  starting_flow: string;
  endg_flow: string;
}
