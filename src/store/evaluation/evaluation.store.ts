import { useMutation, useQuery } from 'react-query';

import * as evaluationService from '../../services/evaluation/evaluation.service';
import {
  IEvaluationAction,
  IEvaluationOwnership,
  IEvaluationStatus,
} from '../../types/services/evaluation.types';

class EvaluationStore {
  createEvaluation() {
    return useMutation(evaluationService.createEvaluation);
  }
  addEvaluationAttendee() {
    return useMutation(evaluationService.addEvaluationAttendee);
  }

  updateEvaluation() {
    return useMutation(evaluationService.updateEvaluation);
  }
  extendEvaluation() {
    return useMutation(evaluationService.extendEvaluation);
  }

  updateEvaluationTimeLimit() {
    return useMutation(evaluationService.updateEvaluation);
  }

  updateEvaluationSection() {
    return useMutation(evaluationService.updateEvaluationSection);
  }

  updateEvaluationApprover() {
    return useMutation(evaluationService.updateEvaluationApprover);
  }

  updateEvaluationReviewer() {
    return useMutation(evaluationService.updateEvaluationReviewer);
  }

  getEvaluationWorkTime(studentEvaluationId: string) {
    return useQuery(['workTime', studentEvaluationId], () =>
      evaluationService.getEvaluationWorkTime(studentEvaluationId),
    );
  }
  updateEvaluationWorkTime() {
    return useMutation(evaluationService.updateEvaluationWorkTime);
  }

  createEvaluationQuestions() {
    return useMutation(evaluationService.createEvaluationQuestion);
  }

  createSingleEvaluationQuestion() {
    return useMutation(evaluationService.createSingleEvaluationQuestion);
  }

  createEvaluationSettings() {
    return useMutation(evaluationService.createEvaluationSettings);
  }

  createSectionBasedEvaluation() {
    return useMutation(evaluationService.createSectionBasedEvaluation);
  }

  // getEvaluations(academy: string, instructor: string) {
  //   return useQuery(['evaluationsByAcademyInstructor'], () =>
  //     evaluationService.fetchEvaluationsByInstructorAndAcademy(academy, instructor),
  //   );
  // }

  getEvaluationsByCategory(evaluationCategory: IEvaluationOwnership, instructor: string) {
    return useQuery(['evaluations', instructor, evaluationCategory], () =>
      evaluationService.getEvaluationsByInstructorAndCategory(
        evaluationCategory,
        instructor,
      ),
    );
  }

  getModuleEvaluations(module: string) {
    return useQuery(['evaluationByModule'], () =>
      evaluationService.fetchEvaluationsByModule(module),
    );
  }

  getModuleEvaluationsForStudent(module: string) {
    return useQuery(['evaluationByModuleForStudent'], () =>
      evaluationService.fetchEvaluationsByModuleForStudent(module),
    );
  }

  getEvaluationsBySubject(subject: string) {
    return useQuery(['evaluations/subject', subject], () =>
      evaluationService.fetchEvaluationsBySubject(subject),
    );
  }
  getEvaluationsCollectionBySubject(subject: string) {
    return useQuery(['evaluationsCollection/subject', subject], () =>
      evaluationService.fetchEvaluationsCollectionBySubject(subject),
    );
  }

  getEvaluationsCollectionByLevelStudent(
    intakeAcademicYearPeriod: string,
    studentId: string,
  ) {
    //  console.log("Promise",intakeAcademicYearPeriod,studentId)
    return useQuery(
      ['evaluationsCollection/subject', intakeAcademicYearPeriod, studentId],
      () =>
        evaluationService.fetchEvaluationsCollectionByLevelStudent(
          intakeAcademicYearPeriod,
          studentId,
        ),
      {
        staleTime: 0,
        cacheTime: 0,
      },
    );
  }

  getEvaluationsCollectionByPeriod(intakeAcademicYearPeriodId: string) {
    return useQuery(
      [
        'evaluations/getAllEvaluationsByIntakeAcademicYearPeriod',
        intakeAcademicYearPeriodId,
      ],
      () =>
        evaluationService.fetchEvaluationsCollectionByPeriod(intakeAcademicYearPeriodId),
      { enabled: !!intakeAcademicYearPeriodId },
    );
  }

  getEvaluationByLevel(levelId: number) {
    return useQuery(['evaluationsCollection/subject', levelId], () =>
      evaluationService.fetchPeriodicEvaluationsCollectionByLevelStudent(levelId),
    );
  }

  getEvaluationsByStudent(subject: string) {
    return useQuery(['evaluations/studentNarrower', subject], () =>
      evaluationService.fetchEvaluationsByStudent(subject),
    );
  }

  getStudentEvaluationByStudentIdAndEvaluationId(
    evaluationId: string,
    studentId: string,
  ) {
    return useQuery(['studEvaluation', evaluationId], () =>
      evaluationService.getStudentEvaluationByStudentIdAndEvaluationId(
        evaluationId,
        studentId,
      ),
    );
  }

  getStudentEvaluationsByStudent(studentId: string) {
    return useQuery(['StudEvaluation', studentId], () =>
      evaluationService.getStudentEvaluationsByStudent(studentId),
    );
  }

  getEvaluationById(id: string, enabled: boolean = true) {
    return useQuery(['evaluation', id], () => evaluationService.getEvaluationById(id), {
      enabled: !!id && enabled,
    });
  }

  getEvaluationByIdAndInstructor(id: string, instructor: string) {
    return useQuery(
      ['evaluation', [id, instructor]],
      () => evaluationService.getEvaluationByIdAndInstructor(id, instructor),
      {
        enabled: !!id,
      },
    );
  }

  getEvaluationApprovalByEvaluationAndInstructor(
    evaluationId: string,
    instructorId: string,
  ) {
    return useQuery(['approvals', evaluationId, instructorId], () =>
      evaluationService.getEvaluationApprovalByEvaluationAndInstructor(
        evaluationId,
        instructorId,
      ),
    );
  }

  getEvaluationReviewByEvaluationAndInstructor(
    evaluationId: string,
    instructorId: string,
  ) {
    return useQuery(['reviewers', evaluationId, instructorId], () =>
      evaluationService.getEvaluationReviewsByEvaluationAndInstructor(
        evaluationId,
        instructorId,
      ),
    );
  }

  getStudentReport(studentId: string) {
    return useQuery(
      ['studentReport', studentId],
      () => evaluationService.getStudentReport(studentId),
      {
        enabled: !!studentId,
      },
    );
  }

  getEvaluationQuestionsByStatus(id: string, status: IEvaluationStatus) {
    return useQuery(
      ['evaluation/questionsbystatus', id],
      () => evaluationService.getEvaluationQuestionsByStatus(id, status),
      { enabled: !!id },
    );
  }

  getEvaluationQuestions(id: string) {
    return useQuery(
      ['evaluation/questions', id],
      () => evaluationService.getEvaluationQuestions(id),
      { enabled: !!id || id.length === 36 },
    );
  }

  getEvaluationQuestionsBySubject(evaluationId: string, subjectId: string) {
    return useQuery(
      ['evaluation/questionsBySubject', subjectId, evaluationId],
      () => evaluationService.getEvaluationQuestionsBySubject(evaluationId, subjectId),
      { enabled: !!evaluationId },
    );
  }

  getEvaluationModuleSubjectById(id: string) {
    return useQuery(
      ['evaluation', id],
      () => evaluationService.getEvaluationModuleSubjectById(id),
      {
        enabled: !!id,
      },
    );
  }

  updateMarkers() {
    return useMutation(evaluationService.updateMarkers);
  }

  deleteEvaluationQuestionById() {
    return useMutation(evaluationService.deleteEvaluationQuestionById);
  }

  deleteEvaluationById() {
    return useMutation(evaluationService.deleteEvaluationById);
  }

  updateEvaluationModuleSubject() {
    evaluationService.updateEvaluationModuleSubject;
  }

  addQuestionAnswer() {
    return useMutation(evaluationService.addQuestionAnswer);
  }

  publishEvaluation() {
    return useMutation(evaluationService.publishEvaluation);
  }

  reviewEvaluation() {
    return useMutation(evaluationService.reviewEvaluation);
  }

  extendStudentEvaluation() {
    return useMutation(evaluationService.extendStudentEvaluation);
  }

  approveEvaluation() {
    return useMutation(evaluationService.approveEvaluation);
  }

  submitEvaluation() {
    return useMutation(evaluationService.submitEvaluation);
  }
  autoSubmitEvaluation() {
    return useMutation(evaluationService.autoSubmitEvaluation);
  }
  studentEvaluationStart() {
    return useMutation(evaluationService.studentEvaluationStart);
  }

  updateEvaluationQuestion() {
    return useMutation(evaluationService.updateQuestion);
  }

  updateMarkersOnModule() {
    return useMutation(evaluationService.updateMarkersOnModule);
  }

  uploadEvaluationQuestionFile() {
    return useMutation(evaluationService.uploadQuestionFile);
  }

  deleteTemplate() {
    return useMutation(evaluationService.deleteTemplate);
  }

  addQuestionDoc() {
    return useMutation(evaluationService.addQuestionDoc);
  }

  addQuestionDocAnswer() {
    return useMutation(evaluationService.addQuestionDocAnswer);
  }

  deleteQuestionAttachment() {
    return useMutation(evaluationService.deleteQuestionAttachment);
  }

  deleteAnswerttachment() {
    return useMutation(evaluationService.deleteAnswerAttachment);
  }

  deleteAnswerFeedbackattachment() {
    return useMutation(evaluationService.deleteAnswerFeedbackAttachment);
  }


  getTemplateById(id: string) {
    return useQuery(['template', id], () => evaluationService.getTemplateById(id), {
      enabled: !!id,
    });
  }

  getEvaluationReviewersById(id: string) {
    return useQuery(
      ['reviwers', id],
      () => evaluationService.getEvaluationReviewersById(id),
      {
        enabled: !!id,
      },
    );
  }

  getEvaluationApprovalsById(id: string) {
    return useQuery(
      ['reviwers', id],
      () => evaluationService.getEvaluationApprovalsById(id),
      {
        enabled: !!id,
      },
    );
  }

  getApprovalsById(id: string) {
    return useQuery(['reviwers', id], () => evaluationService.getApprovalsById(id), {
      enabled: !!id,
    });
  }

  createTemplate() {
    return useMutation(evaluationService.createTemplate);
  }
}

export function getEvaluationFeedbacks(
  evaluationId: string,
  actionType: IEvaluationAction,
) {
  return useQuery(
    ['evaluationApprovals', evaluationId],
    () => evaluationService.getEvaluationFeedbacks(evaluationId, actionType),
    { enabled: !!actionType },
  );
}

export function getTemplates(academyId: string) {
  return useQuery(
    ['templates', academyId],
    () => evaluationService.getEvaliationTemplates(academyId),
    { enabled: !!academyId && academyId !== 'undefined' },
  );
}

export function addFeedbackAttachment() {
  return useMutation(evaluationService.uploadFeedbackAttachment);
}

export function deleteFeedbackAttachment() {
  return useMutation(evaluationService.removeFeedbackAttachment);
}

export const evaluationStore = new EvaluationStore();
