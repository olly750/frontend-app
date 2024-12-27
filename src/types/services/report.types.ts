/* eslint-disable no-unused-vars */
import { AcademyInfo } from './academy.types';
import { IStudent } from './class.types';
import { Status } from './division.types';
import { EnrollmentStatus } from './enrollment.types';
import {
  AttachementInfo,
  IEvaluationInfo,
  IEvaluationQuestionsInfo,
} from './evaluation.types';
import { IclassWorkGroupInfo, IEvaluationStatus } from './evaluation.types';
import { InstitutionInfo } from './institution.types';
import { UserType } from './user.types';

interface ISubjectReport {
  adminId: string;
  classWorkGroups: IclassWorkGroupInfo[];
  id: string;
  title: string;
}

export enum PromotionStatus {
  PROMOTED = 'PROMOTED',
  RETAKE = 'RETAKE',
  DISMISSED = 'DISMISSED',
  PENDING = 'PENDING',
}

export interface PromotionParams {
  reportId: string;
  levelId: string;
  classId: string;
}

export interface PromotionType {
  id: string;
  promotion_status: PromotionStatus;
  enrolment_status: EnrollmentStatus;
  intake_academic_level_enrolment_id: string;
  next_intake_academic_level_enrolment_id: '';
  position: number;
  final_level: boolean;
}

export interface IStudentSujectPerformance {
  exam_marks: number;
  exam_obtained_marks: number;
  id: string;
  obtained_marks: number;
  quiz_marks: number;
  quiz_obtained_marks: number;
  subject: ISubjectReport;
  total_marks: number;
}

export interface IOverallStudentPerformance {
  exam_marks: number;
  exam_obtained_marks: number;
  id: string;
  obtained_marks: number;
  position: number;
  total_students: number;
  quiz_marks: number;
  quiz_obtained_marks: number;
  student: IStudent;
  subject_marks: IStudentSujectPerformance[];
  total_marks: number;
  promotion_status: PromotionStatus;
}

interface AttemptedEvaluation {
  createdAt: string;
  evaluation: string;
  id: string;
  lastUpdatedAt: string;
  obtainedMarks: number;
  totalMarks: number;
}
export interface IOverallEvaluationStudentPerformance {
  attemptedEvaluations: AttemptedEvaluation[];
  createdAt: string;
  id: string;
  intakeAcademicYearPeriod: EvPeriod;
  intakeLevelClass: EvClass;
  lastUpdatedAt: string;
  obtainedMarks: number;
  position: number;
  student: EvStudent;
  totalMarks: number;
}

interface EvClass {
  adminId: string;
  className: string;
  id: string;
}

interface EvPeriod {
  id: string;
  adminId: string;
}
export interface IOverallLevelPerformance {
  attemptedEvaluations: AttemptedEvaluation[];
  createdAt: string;
  id: string;
  intakeAcademicYearPeriod: EvPeriod;
  intakeLevelClass: EvClass;
  lastUpdatedAt: string;
  obtainedMarks: number;
  position: number;
  student: EvStudent;
  totalMarks: number;
}

interface ISubjectMarks {
  created_at: string;
  exam_marks: number;
  exam_obtained_marks: number;
  id: string;
  last_updated_at: string;
  obtained_marks: number;
  quiz_marks: number;
  quiz_obtained_marks: number;
  subject: ISubject;
  total_marks: number;
}
interface ISubject {
  adminId: string;
  id: string;
  moduleEnrollmentId: string;
  title: string;
}

export interface IPerformanceTable {
  id: string;
  first_name: string | any;
  last_name: string | any;
  rank: string;
  [index: string]: string | number;
}


export interface IMarkingProgressTable {
  id: string;
  names: string | any;
  [index: string]: string | number;
}


export interface ITermlyPerformanceTable {
  first_name: string | any;
  last_name: string | any;
  [index: string]: string | number;
}

export interface IQuestionPerformance {
  obtainedTotal: number;
  question: string;
  questionTotal: number;
}
export interface IEvaluationPerformance {
  id: string;
  student: IStudent;
  questionPoints: IQuestionPerformance[];
}

export interface MarkerSectionMarkingProgressReport {
  sectionId: string;
  sectionNames: string;
  totalNumQuestions: number;
  instructorId: string;
  instructorAdminId: string;
  instructorNames: string;
}

export interface SectionMarkingProgressReport {
  sectionId: string;
  totalMarked: string;
}

export interface StudentMarkingProgressReport {
  adminId: string;
  id: string;
  regNumber: string;
  username: string;
  markedQuestions: SectionMarkingProgressReport[];
}

export interface IEvaluationMarkingProgressReport {
  evaluation: IEvaluationInfo;
  marker_sections: MarkerSectionMarkingProgressReport[];
  students: StudentMarkingProgressReport[];
}

export interface IModuleTermPerformance {
  id: string;
  student: IStudent;
  evaluationAttempts: [
    {
      evaluationId: string;
      evaluationName: string;
      maximum: number;
      obtained: number;
    },
  ];
}

interface EvUser {
  academy: AcademyInfo;
  academyId: string;
  adminId: string;
  createdOn: string;
  id: string;
  institution: InstitutionInfo;
  institutionId: string;
  passwordResetPeriodInDays: number;
  status: Status;
  token: string;
  userType: UserType;
  username: string;
}

export interface EvStudent {
  admin_id: string;
  id: string;
  reg_number: string;
  since_on: string;
}

export interface ISubjective {
  created_by: string;
  created_on: string;
  id: string;
  last_modification_on: string;
  marker: EvUser;
  student: EvStudent;
  subjective_label: TermFormSection;
  subjective_value: string;
  term: string;
  updated_by: string;
}

export interface InformativeReport {
  dsAssessments: {
    evaluationId: string;
    evaluationName: string;
    id: string;
    maximum: number;
    obtained: number;
  }[];
  evaluationAttempts: {
    evaluationId: string;
    evaluationName: string;
    id: string;
    maximum: number;
    obtained: number;
  }[];
  student: EvStudent;
  studentSubjective: ISubjective[];
  term: string;
}

export interface ISubjectiveForm {
  studentId: string;
  subjectiveLabel: TermFormSection | TermFormComment;
  subjectiveValue: string;
  termId: string;
}

export interface DSAssessForm {
  term: number;
  label: string;
  receiver: string;
  value: string;
  week: number;
}

export interface IEditSubjectiveForm extends ISubjectiveForm {
  id: string;
}

export interface TwetForm {
  id: string;
  pen_picture: string;
  student_id: string;
  term: string;
}

interface Twet {
  code: string;
  created_by: string;
  created_on: string;
  due_on: string;
  evaluation: IEvaluationInfo;
  id: string;
  last_modification_on: string;
  marking_status: IEvaluationStatus;
  obtained_mark: number;
  remark: string;
  start_on: string;
  student: EvStudent;
  submission_status: IEvaluationStatus;
  submitted_on: string;
  total_mark: number;
  updated_by: string;
  updated_on: string;
  work_time: number;
}

interface TwetAnswers {
  created_by: string;
  created_on: string;
  evaluation: IEvaluationInfo;
  evaluation_question: IEvaluationQuestionsInfo;
  id: string;
  last_modification_on: string;
  mark_scored: number;
  marked: boolean;
  multiple_choice_answer: string;
  open_answer: string;
  student_answer_attachments: {
    attachment: AttachementInfo;
  }[];
  student_evaluation: Twet;
  updated_by: string;
}
export interface TwetReport {
  answers: TwetAnswers[];
  id: string;
  pen_picture: string;
  student: EvStudent;
  term: string;
  tewt: Twet;
  tewt_id: string;
}

export interface DSAssessReport {
  term: number;
  week: number;
  author: EvUser;
  critique_rows: { id: string; label: string; value: string }[];
  id: string;
  receiver: EvUser;
}

export enum TermFormSection {
  INTRODUCTION = 'INTRODUCTION',
  WRITTEN_WORK = 'WRITTEN_WORK',
  ORAL_WORK = 'ORAL_WORK',
  ATTITUDE_TO_WORK = 'ATTITUDE_TO_WORK',
  PRATICAL_ABILITY = 'PRATICAL_ABILITY',
  EXTRACURRICULAR_ACTIVITY = 'EXTRACURRICULAR_ACTIVITY',
  SUMMARY = 'SUMMARY',
}
export enum TermFormComment {
  INTELLECTUAL_COMPETENCE = 'INTELLECTUAL_COMPETENCE',
  PROFESSIONAL_COMPETENCE = 'PROFESSIONAL_COMPETENCE',
  PERSONAL_QUALITIES = 'PERSONAL_QUALITIES',
}
