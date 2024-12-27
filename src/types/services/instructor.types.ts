import { Table } from '..';
import { AcademyInfo } from './academy.types';
import { IntakeProgram } from './intake.types';
import { UserInfo } from './user.types';

export interface DeployInstructor {
  academy_id: string;
  institution_id: string;
  deployed_on: string;
  deployment_number: string;
  description: string;
  user_id: string;
}

export interface InstructorProgram extends Table {
  id: string;
  instructor: Instructor;
  intake_program: IntakeProgram;
}

export interface InstructorModuleAssignment extends Table {
  id: string;
  intake_program_instructor_id: string;
  course_module_id: string;
}

export interface Instructor extends Table {
  institution_id: string;
  since_on: string;
  user: UserInfo;
  academy: AcademyInfo;
  description: string;
}
export interface InstructorDeployed extends Table, DeployInstructor {
  user: UserInfo;
}
