import { Table } from '..';
import { IClass, IClassStudent } from './class.types';
import { StudentEvaluationInfo } from './marking.types';
import { ExtendedSubjectInfo } from './subject.types';
import { Student } from './user.types';

export enum IEvaluationTypeEnum {
  EXAM = 'EXAM',
  CAT = 'CAT',
  GROUP_WORK = 'GROUP_WORK',
  QUIZ = 'QUIZ',
  RESEARCH_PAPER = 'RESEARCH_PAPER',
  DS_ASSESSMENT = 'DS_ASSESSMENT',
  TEWT = 'TEWT',
  RIC = 'RIC',
  HOMEWORK = 'HOME_WORK',
}

export enum IQuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  OPEN = 'OPEN',
}

export enum IQuestionaireTypeEnum {
  MANUAL = 'MANUAL',
  FIELD = 'FIELD',
  DEFAULT = 'DEFAULT',
  HYBRID = 'HYBRID',
}

export interface IEvaluationProps {
  handleNext: (step: number) => void;
  handleGoBack: () => void;
  handleAddQuestion?: () => void;
  evaluationId: string | null;
  evaluationInfo?: IEvaluationInfo;
}

export enum IEvaluationSettingType {
  SECTION_BASED = 'SECTION_BASED',
  SUBJECT_BASED = 'SUBJECT_BASED',
}

export enum ISubmissionTypeEnum {
  FILE = 'FILE',
  ONLINE_TEXT = 'ONLINE_TEXT',
}

export enum IEvaluationOwnership {
  CREATED_BY_ME = 'CREATED_BY_ME',
  FOR_REVIEWING = 'FOR_REVIEWING',
  FOR_APPROVING = 'FOR_APPROVING',
  FOR_MARKING = 'FOR_MARKING',
  FOR_SETTING = 'FOR_SETTING',
}

export enum IEvaluationClassification {
  MODULE = 'MODULE',
  SUBJECT = 'SUBJECT',
}

export enum IEligibleClassEnum {
  MULTIPLE = 'MULTIPLE',
  SINGLE = 'SINGLE',
}

export enum IAccessTypeEnum {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export enum IContentFormatEnum {
  MP4 = 'MP4',
  PNG = 'PNG',
  DOC = 'DOC',
  PDF = 'PDF',
}

export enum IEvaluationStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ON_GOING = 'ON_GOING',
  ONGOING = 'ONGOING',
  SUBMITTED = 'SUBMITTED',
  UNMARKED = 'UNMARKED',
  MARKING = 'MARKING',
  MARKED = 'MARKED',
  CANCELED = 'CANCELED',
  REVIEWING = 'REVIEWING',
  REVIEW_REJECTED = 'REVIEW_REJECTED',
  REVIEWED = 'REVIEWED',
  APPROVING = 'APPROVING',
  APPROVAL_REJECTED = 'APPROVAL_REJECTED',
  APPROVED = 'APPROVED',
  HIDDEN = 'HIDDEN',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum IEligibleGroup {
  MULTIPLE_CLASSES = 'MULTIPLE_CLASSES',
  SINGLE_CLASS = 'SINGLE_CLASS',
}

export enum IEvaluationAppprovalStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVING = 'APPROVING',
  REVIEWED_TO_APPROVE = 'REVIEWED_TO_APPROVE',
  RETURNED = 'REVIEWED_TO_APPROVE',
  APPROVED = 'APPROVED',
}

export interface InstructorEvaluationAppprovalStatus extends Table {
  id: string;
  evaluation_approval_status: IEvaluationAppprovalStatus | IEvaluationAppprovalStatus;
  evaluation_reviewer_status: IEvaluationAppprovalStatus | IEvaluationAppprovalStatus;
  remarks: string;
}

export interface IEvaluationActionInfo extends Table {
  evaluation_reviewer_status: IEvaluationAppprovalStatus | IEvaluationAppprovalStatus;
  reviewer: { adminId: string; id: string };
  remarks: string;
}

export interface ExtendSubmissionType {
  id: string;
  minutes: string;
}

export enum UpdateEvaluationApprovalStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVIEWED = 'REVIEWED',
}

export interface IUpdateEvaluationApprovalStatus {
  evaluation_approval_status?: UpdateEvaluationApprovalStatusEnum;
  evaluation_id: string;
  evaluation_reviewer_status?: UpdateEvaluationApprovalStatusEnum;
  instructor_id: string;
  remarks: string;
}

export interface IEvaluationCreate {
  access_type: string;
  private_attendees: string;
  academy_id: string;
  instructor_id: string;
  allow_submission_time: string;
  intake_level_class_ids: string;
  subject_academic_year_period_id: string;
  classification: IEvaluationClassification;
  content_format: string;
  due_on: string;
  eligible_group: string;
  evaluation_status: IEvaluationStatus;
  evaluation_type: IEvaluationTypeEnum;
  exam_instruction: string;
  is_consider_on_report: boolean;
  marking_reminder_date: string;
  maximum_file_size: number | string;
  name: string;
  id: string;
  questionaire_type: IQuestionaireTypeEnum;
  submision_type: ISubmissionTypeEnum;
  time_limit: number;
  total_mark: number;
  intake_academic_year_period: string;
  strict: boolean;
  marking_type: IMarkingType;
  intakeId: string;
  intake_program_level: string;
  setting_type: IEvaluationSettingType;
  evaluation_mode: IEvaluationMode;
}

export interface IEvaluationUpdate {
  id: string;
  academy_id: string;
  access_type: string;
  allow_submission_time: string;
  classification: IEvaluationClassification;
  consider_on_report: boolean;
  content_format: string;
  due_on: string;
  eligible_group: string;
  evaluation_mode: IEvaluationMode;
  evaluation_status: IEvaluationStatus;
  evaluation_type: IEvaluationTypeEnum;
  exam_instruction: string;
  group_evaluations: string;
  instructor_id: string;
  intake_academic_year_period: string;
  intake_level_class_ids: string;
  intake_program_level: string;
  is_consider_on_report: boolean;
  marking_reminder_date: string;
  marking_type: IMarkingType;
  maximum_file_size: number | string;
  name: string;
  private_attendees: string;
  questionaire_type: IQuestionaireTypeEnum;
  setting_deadline: string;
  setting_type: IEvaluationSettingType;
  strict: boolean;
  subject_academic_year_period_id: string;
  submision_type: ISubmissionTypeEnum;
  time_limit: number;
  total_mark: number;
}

export type IEvaluationSectionBased = {
  id: string;
  marker_id: string;
  evaluation_id: string;
  section_name: string;
  instructor_subject_assignment: string;
  number_of_questions: number;
  intake_program_level_module: string;
  questionaire_setting_status: IEvaluationStatus;
  section_total_marks: number;
  subject_academic_year_period: number | string;
  module_subject?: {
    adminId: string;
    id: string;
    moduleEnrollmentId: string;
    title: string;
  };
  marker?: { id: string; username: string, adminId: string };
};

export type IUpdateEvaluationApprover = {
  id: string;
  approverId: string;
};

export type IUpdateEvaluationReviewer = {
  id: string;
  reviewerId: string;
};


export interface IModules {
  id: string;
  module: string;
}

export interface ISubjects {
  id: string;
  subject: string;
  questions?: IEvaluationQuestionsInfo[];
}

export type IEvaluationAction =
  | 'reviews'
  | 'approvals'
  | 'section_based'
  | ''
  | 'questions_review';

export interface IStudentEvaluations {
  undoneEvaluations: IEvaluationInfo[];
  unfinishedEvaluations: any[];

  ongoingEvaluations: any[];
}

export interface IAddprivateAttendee {
  evaluation: string;
  id: string;
  private_status: boolean;
  students: string[];
}

export interface IPrivateAttendeeInfo extends Table {
  student: Student;
  evaluation: IEvaluationInfo;
}

interface ISubjectAcademicYearPeriod {
  adminId: string;
  id: string;
}

export interface IEvaluationInfo extends Table {
  id: string;
  name: string;
  academy_id: string;
  intake_level_class_ids: string;
  intake_academic_year_period: string;
  subject_academic_year_period: { admSubject: ISubjectAcademicYearPeriod }[]; //used on on get
  evaluation_module_subjects: IEvaluationSectionBased[];
  subject_id: string;
  access_type: IAccessTypeEnum;
  evaluation_type: IEvaluationTypeEnum;
  questionaire_type: IQuestionaireTypeEnum;
  instructor_id: string;
  exam_instruction: string;
  submision_type: ISubmissionTypeEnum;
  total_mark: number;
  evaluation_status: IEvaluationStatus;
  submission_status?: IEvaluationStatus;
  eligible_group: IEligibleGroup;
  extended: boolean;
  classification: IEvaluationClassification;
  allow_submission_time: string;
  due_on: string;
  time_limit: number;
  marking_reminder_date: string;
  content_format: string;
  maximum_file_size: number;
  is_consider_on_report: boolean;
  is_to_be_approved: boolean;
  is_to_be_marked: boolean;
  is_to_be_reviewed: boolean;
  available: string;
  strict: boolean;
  number_of_questions: string;
  marking_type: IMarkingType;
  subject_academic_year_period_id: string;
  group_evaluations: [];
  private_attendees: IPrivateAttendeeInfo[];
  student_answers: [];
  evaluation_markers: Markers[];
  evaluation_attachments: [];
  evaluation_approvals: [];
  student_evaluations: [];
  evaluation_comments: [];
  setting_type: IEvaluationSettingType;
  evaluation_module: IEvaluationMode;
  evaluation_mode: IEvaluationMode;
}


export interface Markers extends Table {
  evaluation_marker_status: string;
  marker: EvaluationMaker;
}

export interface EvaluationMaker {
  username: string;
  id: string;
  adminId: string;
  token: any;
  userType: string;
  passwordResetPeriodInDays: number;
  createdOn: string;
  status: string;
  academy: any;
  academyId: any;
}


export enum IEvaluationMode {
  'INDOOR' = 'INDOOR',
  'OUTDOOR' = 'OUTDOOR',
}

export interface IEvaluationInfoCollected {
  undone_evaluations: IEvaluationInfoSingleEvaluation[];
  ongoing_evaluations: IEvaluationInfoSingleEvaluation[];
  finished_evaluations: IEvaluationInfoSingleEvaluation[];
}

export interface IEvaluationInfoLevelEvaluation {

  id: string;
  name: string;
  code: string;
  obtainedMark: number;
  evaluation: IEvaluationInfo;
  student: any[];
  startOn: string;
  dueOn: string;
  submittedOn: string;
  totalMark: number;
  submissionStatus: string;
  markingStatus: string;
  numberOfQuestions: string;
  allowSubmissionTime: string;
  timeLimit: string;
}




export interface IEvaluationInfoSingleEvaluation {
  code: string;
  evaluation: IEvaluationInfo;
  id: string;
}

export interface IEvaluationChoices {
  answer_content: string;
  correct: boolean;
}

export interface IEvaluationQuestion {
  evaluation_id: string;
  multiple_choice_answers?: IMultipleChoice[];
  mark: number;
  parent_question_id: string;
  question: string;
  submitted: boolean;
  question_type: IQuestionType;
  attachments?: AttachementInfo[];
}

export interface IMultipleChoice {
  answer_content: string;
  correct: boolean;
  id: string;
}

export enum IMarkingType {
  // PER_STUDENT = 'PER_STUDENT',
  //NOT_APPLICABLE = 'NOT_APPLICABLE',
  ANY_MARKER = 'ANY_MARKER',
  // NOT_SET = 'NOT_SET',
  PER_SECTION = 'PER_SECTION',
  // PER_QUESTION = 'PER_QUESTION',
}

export interface ICreateEvaluationQuestions extends IEvaluationQuestion {
  sub_questions: IEvaluationQuestion[];
  submitted: boolean;
  question_type: IQuestionType;
  id: string;
  answer: string;
  evaluation_module_subject_id?: string;
  choices: IMultipleChoice[];
  attachments?: AttachementInfo[];
}

export interface IMultipleChoiceAnswers {
  answer_content: string;
  correct: boolean;
  highlight?: boolean;
  id: string;
  mark: number;
}

export interface IEvaluationQuestionsInfo {
  id: string;
  answer: string;
  question: string;
  evaluation_id: string;
  choices: IMultipleChoice[];
  choosen_question: IEvaluationStatus;
  mark: number;
  evaluationQuestions: [];
  question_type: IQuestionType;
  attachments: AttachementInfo[];
  multiple_choice_answers: IMultipleChoiceAnswers[];
  evaluation_module_subject: IEvaluationSectionBased;
}

export interface AttachementInfo extends Table {
  attachment_type: string;
  name: string;
  path: string;
  size: number;
  size_type: string;
  status: string;
  type: string;
  updated_by: string;
  url: string;
}

export type IEvaluationSectionBasedInfo = {
  id: string;
  marker_id: string;
  evaluation_id: string;
  section_name:string;
  instructor_subject_assignment: string;
  intake_program_level_module: string;
  questionaire_setting_status: IEvaluationStatus;
  section_total_marks: number;
  number_of_questions: number;
  subject_academic_year_period: number | string;
  module_subject: ExtendedSubjectInfo;
};

export interface IEvaluationApproval {
  approver_ids: string;
  evaluation_id: string;
  id: string;
  reviewer_ids: string;
  marker_ids?: string | undefined;
  to_be_approved: boolean;
  to_be_reviewed: boolean;
}

export interface IStudentAnswer {
  answer_attachment: string;
  evaluation_question: string;
  mark_scored: number | null;
  isSubmitted?: boolean;
  isDirty?: boolean;
  multiple_choice_answer: string;
  open_answer: string | null;
  student_evaluation: StudentEvaluationInfo | string;
}

export interface StudentEvalParamType {
  evaluationId: string;
}
export interface IStudentEvaluationStart {
  attachment: string;
  evaluation_id: string;
  student_id: string;
}
export interface IStudentEvaluationStartInfo {
  id: string;
  evaluation: IEvaluationInfo;
}

export interface IEvaluationsReport extends Table {
  evaluation: IEvaluationInfo;
}

export interface IclassWorkGroupInfo extends Table {
  evaluations: IEvaluationsReport;
  group_members: IClassStudent[];
  intake_level_class: IClass;
  intake_level_class_id: string;
  subject_id: string;
  team_leader: IClassStudent;
  team_leader_id: string;
}

export interface IEvaluationTemplateInfo extends Table {
  name: string;
  academy_id: string;
  allow_submission_time: string;
  due_on: string;
  marking_reminder_date: null;
}


export interface IEvaluationReviewers {
  created_by: string;
  updated_by: string;
  created_on: string;
  last_modification_on: string;
  id: string;
  evaluation_reviewer_status: string;
  evaluation_approval_status:string;
  approver: Approval;
  reviewer: Reviewer;
  remarks: string;
}

export interface Reviewer {
  username: string;
  id: string;
  adminId: string;
  token: string;
  userType: string;
  passwordResetPeriodInDays: number;
  createdOn: string;
  status: string;
  institution: Institution;
  academy: Academy;
  academyId: string;
  institutionId: string;
}
export interface Approval {
  username: string;
  id: string;
  adminId: string;
  token: string;
  userType: string;
  passwordResetPeriodInDays: number;
  createdOn: string;
  status: string;
  institution: Institution;
  academy: Academy;
  academyId: string;
  institutionId: string;
}

export interface Institution {
  id: string;
  adminId: string;
  shortName: string;
  createdOn: string;
}

export interface Academy {
  id: string;
  shortName: string;
  adminId: string;
  institutionId: any;
  institution: Institution;
}

