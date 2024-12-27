import { GenericStatus, Privileges } from '..';
import { StudentApproval } from './enrollment.types';
import { IEvaluationStatus } from './evaluation.types';
import { IntakeStatus } from './intake.types';
import { IntakeModuleStatus } from './intake-program.types';

/* eslint-disable no-undef */
export interface ActionsType<T> {
  name: string;
  handleAction: (_data?: T[keyof T]) => void;
  privilege?: Privileges;
}

export interface Selected {
  selected?: boolean;
  status?: string;
}

export interface SelectorActionType {
  name: string;
  handleAction: (_data?: string[]) => void;
  privilege?: Privileges;
}

export interface StatusActionType<T> {
  name: string;
  type:
    | GenericStatus
    | IntakeStatus
    | IEvaluationStatus
    | IntakeModuleStatus
    | StudentApproval;
  handleStatusAction: (_data?: T[keyof T]) => void;
}
