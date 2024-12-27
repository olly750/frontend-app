import { AxiosResponse } from 'axios';

import { evaluationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  AttachementInfo,
  ExtendSubmissionType,
  IAddprivateAttendee,
  ICreateEvaluationQuestions,
  IEvaluationAction,
  IEvaluationActionInfo,
  IEvaluationApproval,
  IEvaluationCreate,
  IEvaluationInfo,
  IEvaluationInfoCollected,
  IEvaluationInfoLevelEvaluation,
  IEvaluationOwnership,
  IEvaluationQuestionsInfo,
  IEvaluationReviewers,
  IEvaluationSectionBased,
  IEvaluationStatus,
  IEvaluationTemplateInfo,
  IEvaluationUpdate,
  InstructorEvaluationAppprovalStatus,
  IStudentAnswer,
  IStudentEvaluationStart,
  IStudentEvaluationStartInfo,
  IUpdateEvaluationApprovalStatus,
  IUpdateEvaluationApprover,
  IUpdateEvaluationReviewer,
} from '../../types/services/evaluation.types';
import { FileAttachment } from '../../types/services/user.types';

export async function createEvaluation(
  evaluationInfo: IEvaluationCreate,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.post('/evaluations/add', evaluationInfo);
}
export async function addEvaluationAttendee(
  attendeeInfo: IAddprivateAttendee,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.post('/privateAttendee/add', attendeeInfo);
}

export async function extendEvaluation(
  evaluationInfo: IEvaluationUpdate,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.put(
    `/studentEvaluations/studentEvaluation/${evaluationInfo.id}/extendByEvaluationId/${evaluationInfo.time_limit}`,
  );
}

//studentEvaluations/studentEvaluation/b476532e-a6a8-482d-aa1c-3b7982b1a6e9/extendByEvaluationId/{minutes}?minutes=60
export async function updateEvaluation(
  evaluationInfo: IEvaluationUpdate,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  // console.log("evaluationInfo",evaluationInfo)
  return await evaluationAxios.put(`/evaluations/modify/${evaluationInfo.id}`, {
    allow_submission_time: evaluationInfo.allow_submission_time,
    classification: evaluationInfo.classification,
    consider_on_report: evaluationInfo.consider_on_report,
    due_on: evaluationInfo.due_on,
    eligible_group: evaluationInfo.eligible_group,
    exam_instruction: evaluationInfo.exam_instruction,
    name: evaluationInfo.name,
    time_limit: evaluationInfo.time_limit,
    total_mark: evaluationInfo.total_mark,
    submision_type: evaluationInfo.submision_type,
    strict: evaluationInfo.strict,
  });
}

export async function updateEvaluationSection(
  evaluationSectionInfo: IEvaluationSectionBased,
): Promise<AxiosResponse<Response<IEvaluationSectionBased>>> {
  return await evaluationAxios.put(
    `/evaluation-module-subjects/modifyById/${evaluationSectionInfo.id}`,
    {
      instructor_subject_assignment: evaluationSectionInfo.instructor_subject_assignment,
      // intake_program_level_module: evaluationSectionInfo.intake_program_level_module,
      marker_id: evaluationSectionInfo.marker_id,
      number_of_questions: evaluationSectionInfo.number_of_questions,
      questionaire_setting_status: evaluationSectionInfo.questionaire_setting_status,
      section_name: evaluationSectionInfo.section_name,
      section_total_marks: evaluationSectionInfo.section_total_marks,
      // subject_academic_year_period: evaluationSectionInfo.subject_academic_year_period
    },
  );
}

export async function updateEvaluationApprover(
  approverDetailsInfo: IUpdateEvaluationApprover,
): Promise<AxiosResponse<Response<IUpdateEvaluationApprover>>> {
  return await evaluationAxios.put(
    `evaluationApprovals/evaluationApproverModifier/${approverDetailsInfo.id}/${approverDetailsInfo.approverId}`,
    {
      id: approverDetailsInfo.id,
      approverId: approverDetailsInfo.approverId,
    },
  );
}

export async function updateEvaluationReviewer(
  reviewerDetailsInfo: IUpdateEvaluationReviewer,
): Promise<AxiosResponse<Response<IUpdateEvaluationReviewer>>> {
  return await evaluationAxios.put(
    `evaluationApprovals/evaluationReviewerModifier/${reviewerDetailsInfo.id}/${reviewerDetailsInfo.reviewerId}`,
    {
      id: reviewerDetailsInfo.id,
      reviewerId: reviewerDetailsInfo.reviewerId,
    },
  );
}

// export async function createEvaluationQuestion(
//   questionsInfo: ICreateEvaluationQuestions[],
// ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
//   return await evaluationAxios.post('/evaluationQuestions/add', {
//     questions: questionsInfo,
//   });
// }
export async function createEvaluationQuestion(
  questionsInfo: ICreateEvaluationQuestions[],
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
  return await evaluationAxios.post('/evaluationQuestions/update-multiple', {
    questions: questionsInfo,
  });
}

export async function createSingleEvaluationQuestion(
  questionsInfo: ICreateEvaluationQuestions,
): Promise<AxiosResponse<Response<{ question: IEvaluationQuestionsInfo }>>> {
  return await evaluationAxios.post('/evaluationQuestions/add', questionsInfo);
}

export async function createEvaluationSettings(
  settings: IEvaluationApproval,
): Promise<AxiosResponse<Response<IEvaluationApproval>>> {
  return await evaluationAxios.post(
    '/evaluationApprovals/addApprovalToEvaluation',
    settings,
  );
}

export async function getEvaluationsByInstructorAndCategory(
  evaluationCategory: IEvaluationOwnership,
  instructorId: string,
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluations/getSimpleEvaluationsByInstructorAndCategory/instructor/${instructorId}?category=${evaluationCategory}`,
  );
}
export async function fetchEvaluationsByInstructorAndAcademy(
  academy: string,
  instructor: string,
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluations/getEvaluationsByAcademy/${academy}/narrowByInstructor/${instructor}`,
  );
}

export async function fetchEvaluationsByModule(
  module: string,
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.get(`/evaluations/getEvaluationsByModule/${module}`);
}

export async function fetchEvaluationsByModuleForStudent(
  module: string,
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.get(`/evaluations/module/${module}/all`);
}
export async function fetchEvaluationsBySubject(
  subject: string,
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.get(`/evaluations/getEvaluationsBySubject/${subject}`);
}
export async function fetchEvaluationsCollectionBySubject(
  subject: string,
): Promise<AxiosResponse<Response<IEvaluationInfoCollected>>> {
  return await evaluationAxios.get(
    `/evaluations/getEvaluationsBySubject/${subject}/studentNarrower`,
  );
}

export async function fetchEvaluationsCollectionByLevelStudent(
  intakeAcademicYearPeriod: string,
  studentId: string,
): Promise<AxiosResponse<Response<IEvaluationInfoLevelEvaluation>>> {
  return await evaluationAxios.get(
    `/studentEvaluations/StudentTermEvaluation/${intakeAcademicYearPeriod}/${studentId}`,
  );
}

export async function fetchEvaluationsCollectionByPeriod(
  intakeAcademicYearPeriodId: string, 
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluations/getAllEvaluationsByIntakeAcademicYearPeriod/${intakeAcademicYearPeriodId}`,
  );
}




export async function fetchEvaluationsByStudent(
  subject: string,
): Promise<AxiosResponse<Response<IEvaluationInfoCollected>>> {
  return await evaluationAxios.get(
    `/evaluations/getEvaluationsBySubject/${subject}/studentNarrower`,
  );
}

// export async function getEvaluationById(
//   id: string,
// ): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
//   return await evaluationAxios.get(`/evaluations/getById/${id}`);
// }
export async function getEvaluationById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.get(`/evaluations/getSimpleEvaluationById/${id}`);
}

export async function getEvaluationModuleSubjectById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationSectionBased>>> {
  return await evaluationAxios.get(`/evaluation-module-subjects/getById/${id}`);
}

//evaluation-module-subjects/getById/{id}getEvaluationModuleAssignmentById

export async function getEvaluationByIdAndInstructor(
  id: string,
  instructor: string,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.get(`/evaluations/getById/${id}/instructor/${instructor}`);
}

export async function getEvaluationFeedbacks(
  evaluationId: string,
  actionType: IEvaluationAction,
): Promise<AxiosResponse<Response<IEvaluationActionInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluations/getByFeedback/${evaluationId}/feedback?feedback_type=${actionType}`,
  );
}

export async function getEvaluationApprovalByEvaluationAndInstructor(
  evaluationId: string,
  instructorId: string,
): Promise<AxiosResponse<Response<InstructorEvaluationAppprovalStatus>>> {
  return await evaluationAxios.get(
    `/evaluationApprovals/approvals/evaluation/${evaluationId}/instructor/${instructorId}`,
  );
}

export async function getEvaluationReviewsByEvaluationAndInstructor(
  evaluationId: string,
  instructorId: string,
): Promise<AxiosResponse<Response<InstructorEvaluationAppprovalStatus>>> {
  return await evaluationAxios.get(
    `/evaluationApprovals/reviews/evaluation/${evaluationId}/instructor/${instructorId}`,
  );
}

export async function getStudentReport(
  studentId: string,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.get(`/getThreeTermSchoolReport/${studentId}`);
}

export async function getStudentEvaluationByStudentIdAndEvaluationId(
  evaluationId: string,
  studentId: string,
): Promise<AxiosResponse<Response<any>>> {
  return await evaluationAxios.get(
    `/studentEvaluations/studentEvaluation/evaluation/${evaluationId}/student/${studentId}`,
  );
}
// getByStudent/{studentId}getAllStudentEvaluations
export async function getStudentEvaluationsByStudent(
  studentId: string,
): Promise<AxiosResponse<Response<any>>> {
  return await evaluationAxios.get(`/studentEvaluations/getByStudent/${studentId}`);
}

export async function getEvaluationQuestionsByStatus(
  id: string,
  status: IEvaluationStatus,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluationQuestions/getEvaluationQuestions/${id}/settingStatus/${status}`,
  );
}

export async function fetchPeriodicEvaluationsCollectionByLevelStudent(
  levelId: number,
): Promise<AxiosResponse<Response<IEvaluationInfoLevelEvaluation>>> {
  return await evaluationAxios.get(
    `/evaluations/getEvaluationsByIntakeAcademicYearPeriod/${levelId}`,
  );
}

export async function getEvaluationQuestions(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
  return await evaluationAxios.get(`/evaluationQuestions/getEvaluationQuestions/${id}`);
}

export async function getEvaluationQuestionsBySubject(
  evaluationId: string,
  subjectId: string,
  abortController?: AbortSignal,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluationQuestions/getEvaluationQuestions/evaluation/${evaluationId}/subject/${subjectId}`,
    { signal: abortController },
  );
}

export async function deleteEvaluationQuestionById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
  return await evaluationAxios.delete(`/evaluationQuestions/deleteQuestion/${id}`);
}

export async function deleteEvaluationById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationInfo[]>>> {
  return await evaluationAxios.delete(`/evaluations/deleteById/${id}`);
}

export async function getEvaluationModuleSubjectsByModule(
  evaluationId: string,
  moduleId: string,
  abortController?: AbortSignal,
): Promise<AxiosResponse<Response<IEvaluationSectionBased[]>>> {
  return await evaluationAxios.get(
    `/evaluation-module-subjects/getByEvaluationAndModule/${evaluationId}/module/${moduleId}`,
    { signal: abortController },
  );
}

export async function addQuestionDoc(
  data: FileAttachment,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.post(
    `/evaluationQuestions/${data.id}/uploadQuestionFile`,
    data.docInfo,
  );
}

export async function addQuestionDocAnswer(
  data: FileAttachment,
): Promise<AxiosResponse<Response<AttachementInfo>>> {
  console.log('add question');
  return await evaluationAxios.post(
    `/student-answers/student-answer/addAttachmentAnswer`,
    data.docInfo,
  );
}

export async function updateEvaluationModuleSubject(
  id: string,
  status: IEvaluationStatus,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo[]>>> {
  return await evaluationAxios.put(
    `evaluation-module-subjects/${id}/changeSettingStatus/${status}`,
  );
}

export async function modifyEvaluation(
  evaluationInfo: IEvaluationCreate,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.put('/evaluations/modifyEvaluation', {
    ...evaluationInfo,
  });
}

export async function getEvaluationWorkTime(
  studentEvaluationId: string,
): Promise<AxiosResponse<Response<any>>> {
  return await evaluationAxios.get(
    `studentEvaluations/studentEvaluation/getWorkTime/${studentEvaluationId}`,
  );
}

export async function updateEvaluationWorkTime({
  studentEvaluationId = '',
  currentTime = '',
}): Promise<void> {
  return await evaluationAxios.put(
    `/studentEvaluations/studentEvaluation/${studentEvaluationId}/currentWorkTime/${currentTime}`,
  );
}

export async function addQuestionAnswer(
  answer: IStudentAnswer,
): Promise<AxiosResponse<Response<IStudentAnswer>>> {
  return await evaluationAxios.post('student-answers/add', answer);
}

export async function updateQuestionChoosen(
  id: string,
  status: IEvaluationStatus,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.put(
    `/evaluationQuestions/${id}/changeChooseStatus/${status}`,
  );
}

export async function submitEvaluation({
  studentEvaluationId,
  evaluationSubmissionComments,
}: {
  studentEvaluationId: string;
  evaluationSubmissionComments: string;
}): Promise<void> {
  return await evaluationAxios.put(
    `studentEvaluations/studentEvaluation/${studentEvaluationId}/submit`,
    evaluationSubmissionComments,
  );
}
export async function autoSubmitEvaluation(studentEvaluationId: string): Promise<void> {
  return await evaluationAxios.put(
    `studentEvaluations/studentEvaluation/${studentEvaluationId}/auto_submit`,
  );
}

export async function publishEvaluation(data: {
  evaluationId: string;
  status: string;
}): Promise<void> {
  return await evaluationAxios.put(
    `/evaluations/evaluation/${data.evaluationId}/${data.status}`,
  );
}

export async function reviewEvaluation(
  updateEvaluation: IUpdateEvaluationApprovalStatus,
): Promise<void> {
  return await evaluationAxios.put(`evaluationApprovals/reviews`, updateEvaluation);
}

export async function extendStudentEvaluation(data: ExtendSubmissionType): Promise<void> {
  return await evaluationAxios.put(
    `studentEvaluations/studentEvaluation/${data.id}/extend/{minutes}?minutes=${data.minutes}`,
  );
}

export async function approveEvaluation(
  updateEvaluation: IUpdateEvaluationApprovalStatus,
): Promise<void> {
  return await evaluationAxios.put(`evaluationApprovals/approvals`, updateEvaluation);
}

export async function studentEvaluationStart(
  student: IStudentEvaluationStart,
): Promise<AxiosResponse<Response<IStudentEvaluationStartInfo>>> {
  return await evaluationAxios.post('studentEvaluations/start', student);
}

export async function createSectionBasedEvaluation(
  evaluation: IEvaluationSectionBased[],
): Promise<AxiosResponse<Response<IEvaluationSectionBased[]>>> {
  return await evaluationAxios.post('evaluation-module-subjects/add-bulk', evaluation);
}

export async function updateQuestion(
  question: IEvaluationQuestionsInfo,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.put(
    `evaluationQuestions/editQuestion/${question.id}`,
    question,
  );
}

export async function updateMarkersOnModule({
  markerId,
  id,
}: {
  markerId: string;
  id: string;
}): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.put(`evaluation-module-subjects/modifyById/${id}`, {
    marker_id: markerId,
  });
}

export async function updateQuestionInfo(
  question: IEvaluationQuestionsInfo,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.put(
    `evaluationQuestions/editQuestion/${question.id}`,
    question,
  );
}

export async function getEvaliationTemplates(
  academyId: string,
): Promise<AxiosResponse<Response<IEvaluationTemplateInfo[]>>> {
  return await evaluationAxios.get(`evaluation-templates/getByAcademyId/${academyId}`);
}

export async function uploadQuestionFile({
  questionId,
  file,
}: {
  questionId: string;
  file: FormData;
}): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.post(
    `evaluationQuestions/${questionId}/uploadQuestionFile`,
    file,
  );
}

export async function deleteTemplate(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationTemplateInfo>>> {
  return await evaluationAxios.delete(`evaluation-templates/deleteById/${id}`);
}

export async function deleteQuestionAttachment({
  questionId,
  attachmentId,
}: {
  questionId: string;
  attachmentId: string;
}): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.delete(
    `evaluationQuestions/${questionId}/removeQuestionFile/${attachmentId}`,
  );
}

export async function deleteAnswerAttachment(
  attachmentId: string,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.delete(
    `student-answers/student-answer/removeAttachment/${attachmentId}`,
  );
}

export async function deleteAnswerFeedbackAttachment(
  attachmentId: string,
): Promise<AxiosResponse<Response<IEvaluationQuestionsInfo>>> {
  return await evaluationAxios.delete(
    `student-answers/instructor-feedback/removeAttachment/${attachmentId}`,
  );
}

export async function getTemplateById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationTemplateInfo>>> {
  return evaluationAxios.get(`evaluation-templates/getById/${id}`);
}

export async function getEvaluationReviewersById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationReviewers[]>>> {
  return evaluationAxios.get(`evaluationApprovals/reviews/getByEvaluationId/${id}`);
}

export async function getEvaluationApprovalsById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationReviewers[]>>> {
  return evaluationAxios.get(`evaluationApprovals/approvals/getByEvaluationId/${id}`);
}

export async function getApprovalsById(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationApproval[]>>> {
  return evaluationAxios.get(`evaluationApprovals/getById/${id}`);
}

export async function createTemplate(
  template: Partial<IEvaluationInfo>,
): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.post('evaluation-templates/add', {
    ...template,
  });
}

export async function updateMarkers({
  evaluation,
  marker_ids,
}: {
  evaluation: string;
  marker_ids: string;
}): Promise<AxiosResponse<Response<IEvaluationInfo>>> {
  return await evaluationAxios.put(`evaluations/update-markers/${evaluation}`, {
    marker_ids,
  });
}

export async function uploadFeedbackAttachment({
  file,
  studentAnswerId,
}: {
  file: File;
  studentAnswerId: string;
}) {
  const formData = new FormData();
  formData.append('file', file);
  return await evaluationAxios.post(
    `/student-answers/instructor-feedback/addFeedbackAttachment/${studentAnswerId}`,
    formData,
  );
}

export async function removeFeedbackAttachment({
  attachmentId,
}: {
  attachmentId: string;
}) {
  return await evaluationAxios.delete(
    `/student-answers/instructor-feedback/removeFeedbackAttachment/${attachmentId}`,
  );
}
