import { RoleType, RoleUsers, SelectData } from '../types';
import { IEvaluationStatus } from '../types/services/evaluation.types';
import { IntakeStatus } from '../types/services/intake.types';
import {
  IntakeModuleStatus,
  ProgressStatus,
} from '../types/services/intake-program.types';
import { UserTypes } from '../types/services/user.types';
import { GenericStatus } from './../types/services/common.types';
import {
  EnrollInstructorLevelInfo,
  EnrollmentStatus,
  StudentApproval,
} from './../types/services/enrollment.types';
import { ModuleParticipation } from './../types/services/intake-program.types';
import { MaterialType } from './../types/services/module-material.types';
import { ProgramStatus } from './../types/services/program.types';

interface GetDropDownOptionsProps {
  inputs: any[];
  labelName?: string[];
  value?: string;
  getOptionLabel?: (_option: Object) => string;
}

export const titleCase = (s: string) => {
  return s
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ');
};

export function getDropDownOptions({
  inputs = [],
  labelName = ['name'],
  value = 'id',
  getOptionLabel,
}: GetDropDownOptionsProps): SelectData[] {
  let options: SelectData[] = [];
  if (labelName.length === 1) {
    inputs?.map((input) => {
      options.push({
        label: getOptionLabel ? getOptionLabel(input) : input[labelName[0]],
        value: input[value] as string,
      });
    });
  } else {
    inputs?.map((input) => {
      options.push({
        label: getOptionLabel
          ? getOptionLabel(input)
          : `${input[labelName[0]]} ${input[labelName[1]]}`,
        value: input[value] as string,
      });
    });
  }

  return options;
}

export function getDropDownStatusOptions(status: any, hidden?: string[]): SelectData[] {
  let selectData: SelectData[] = [];
  if (status) {
    let stats = Object.keys(status).filter((key) => status[key]);
    stats.map((val) => {
      let label = val.toString().replaceAll('_', ' ');
      let input = {
        label: titleCase(label),
        value: val.toString(),
      };
      if (hidden) {
        if (!hidden.includes(val.toString())) {
          selectData.push(input);
        }
      } else {
        selectData.push(input);
      }
    });
  }
  return selectData;
}

export function getDropDownUnitOptions(status: any, hidden?: string[]): SelectData[] {
  let selectData: SelectData[] = [];
  if (status) {
    let stats = Object.keys(status).filter((key) => status[key]);
    stats.map((val) => {
      let label = val.toString().replaceAll('_', ' ');
      let input = {
        label: (label),
        value: val.toString(),
      };
      if (hidden) {
        if (!hidden.includes(val.toString())) {
          selectData.push(input);
        }
      } else {
        selectData.push(input);
      }
    });
  }
  return selectData;
}

export function advancedTypeChecker(
  status:
    | GenericStatus
    | IntakeStatus
    | IEvaluationStatus
    | IntakeModuleStatus
    | ModuleParticipation
    | MaterialType
    | EnrollmentStatus
    | StudentApproval
    | ProgramStatus
    | ProgressStatus
    | RoleType,
): 'success' | 'warning' | 'error' | 'info' {
  let successStatus = ['active', 'completed', 'opened', 'started'];
  let errorStatus = ['inactive', 'closed', 'voided', 'suspended'];
  let infoStatus = [
    'ongoing',
    'notes',
    'exams',
    'workshop',
    'seminaries',
    'academy',
    'institution',
  ];

  if (successStatus.includes(status.toString().toLowerCase())) return 'success';
  else if (errorStatus.includes(status.toString().toLowerCase())) return 'error';
  else if (infoStatus.includes(status.toString().toLowerCase())) return 'info';
  else return 'warning';
}

export const getInchargeDropdown = (users?: RoleUsers[]): SelectData[] => {
  let options: SelectData[] = [];

  users?.map((user) => {
    options.push({
      label: `${user.user.first_name} ${user.user.last_name}`,
      value: user.id.toString(),
    });
  });

  return options;
};

export const getInstructorIncharge = (
  instr?: EnrollInstructorLevelInfo[],
): SelectData[] => {
  let options: SelectData[] = [];

  instr?.map((ins) => {
    options.push({
      label: `${
        ins.intake_program_instructor.instructor.user.person?.current_rank
          ?.abbreviation || ''
      } ${ins.intake_program_instructor.instructor.user.first_name} ${
        ins.intake_program_instructor.instructor.user.last_name
      }`,
      value: ins.intake_program_instructor.instructor.id.toString(),
    });
  });

  return options;
};

export const getSpecificInchargeDropdown = (users?: UserTypes[]): SelectData[] => {
  let options: SelectData[] = [];

  users?.map((user) => {
    options.push({
      label: user['full name'],
      value: user.id.toString(),
    });
  });

  return options;
};
