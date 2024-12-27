/* eslint-disable no-unused-vars */

import { Table } from '..';
import {
  AttachementInfo,
  IEvaluationInfo,
  IEvaluationQuestionsInfo,
  IEvaluationStatus,
  IMultipleChoice,
} from './evaluation.types';

export interface SampleQuestionInfo {
  question: string;
  mark: number;
}

export interface AnswerComment {
  answerComment: string;
  marks: number;
}

export interface MarkingRequired {
  answer_id: string;
  mark: number;
}

export interface MarkingCorrection {
  marked: boolean | undefined;
  markScored: number;
  answerId: string;
}

export interface IManualMarking {
  evaluation_id: string;
  marks: number;
  student_id: string;
  marking_status?: IEvaluationStatus;
  mark?: number;
}

export interface UnMarkedStudent {
  id: string;
  rank: string;
  first_name: string;
  last_name: string;
  obtained: string;
  out_of: string;
}

export interface FieldQuestionMarks {
  question_id: string;
  obtained_marks: number;
}

export interface PointsUpdateInfo {
  answer_id: string;
  is_updating: boolean;
  obtained: number | undefined;
}

export interface StudentAnswerMarkInfo {
  answer_id: string;
  marks: number;
}

export interface SingleFieldStudentMarker {
  evaluation_id: string;
  student_id: string;
  questions_marks: FieldQuestionMarks[];
}

export interface EvaluationStudent {
  admin_id: string;
}

export interface IManualMarkingInfo {
  evaluation: IEvaluationInfo;
  obtained_mark: number;
  student: EvaluationStudent;
  marking_status?: IEvaluationStatus;
}

export interface StudentMarkingAnswer extends Table {
  id: '';
  mark_scored: number;
  marked: boolean;
  answer_comment: string;
  evaluation_question: IEvaluationQuestionsInfo;
  multiple_choice_answer: IMultipleChoice;
  student_answer_attachments: {
    id: string;
    attachment: AttachementInfo;
    student_code: string;
  }[];
  student_evaluation: { 
    code: string;
  };
  
  attachment: AttachementInfo;
  open_answer: string;
}

export interface FinalizeMarking {
  remarks: string;
  available: string;
}

export interface StudentEvaluationInfo extends Table {
  id: string;
  due_on: string;
  extended_due_on: string;
  student: EvaluationStudent;
  evaluation: IEvaluationInfo;
  work_time: number;
  code: string;
  marking_status: string;
  remaining_time_in_minutes: number;
  remaining_time_in_seconds: number;
  remark: string;
  obtained_mark: number;
  total_mark: number;
  extended_minutes: number;
  start_on: string | number;
}

export interface StudentEvaluationSubmissionInfo extends Table {
  submissionStatus: string;
  studentAdminId: string;
  names: string;
  studentId: string;
  code: string;
  startOn: string | number;
  obtainedMarks: number;
  numberQuestion: number;
  totalmarks: number;
  marked: number;
  unmarked: number;
  marking_pogress: string;
}

export interface MarkAllEvaluationQuestions {
  studentEvaluation: string;
  correction: MarkingCorrection[];
}

export interface StudentAnswerInfo {
  openAnswer: string;
  markScored: number;
  marked: boolean;
  id: string;
  question: SampleQuestionInfo;
}
