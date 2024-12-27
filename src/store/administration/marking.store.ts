import { useMutation, useQuery } from 'react-query';

import * as markingService from '../../services/administration/marking.service';

export function saveAnswer() {
  return useMutation(markingService.saveAnswer);
}
export function finishMarking() {
  return useMutation(markingService.finishMarking);
}
export function updateStudentAnswer() {
  return useMutation(markingService.updateStudentAnswer);
}

export function fieldMarkingFinish() {
  return useMutation(markingService.fieldMarkingFinish);
}

export function finalizaMarkingWithRemarks() {
  return useMutation(markingService.finalizaMarkingWithRemarks);
}

export function manualMarking() {
  return useMutation(markingService.addManualMarking);
}

export function publishResults() {
  return useMutation(markingService.publishResults);
}

export function publishResult() {
  return useMutation(markingService.publishResult);
}

export function getStudentEvaluationAnswers(id: string) {
  return useQuery(['studentEvaluation/answers', id], () =>
    markingService.getStudentEvaluationAnswers(id),
  );
}

export function getStudentEvaluationAnswersFeedback(id: string) {
  return useQuery(['studentEvaluation/answers', id], () =>
    markingService.getStudentEvaluationAnswersFeedback(id),
  { enabled: !!id },
  );
}


export function getStudentEvaluationAnswersData(id: string) {
  return markingService.getStudentEvaluationAnswers(id); // Return the promise from the service
}

export function getEvaluationMarkingModules(id: string, enabled: boolean = false) {
  return useQuery(
    ['markingModules', id],
    () => markingService.getEvaluationMarkingModules(id),
    { enabled },
  );
}

export function getManualMarkingMarks(evaluationId: string, classId: string) {
  return useQuery(['manualMarkingMarks', evaluationId, classId], () =>
    markingService.getManualMarkingMarks(evaluationId, classId),
  );
}

export function getStudentEvaluationById(id: string, enabled: boolean = true) {
  return useQuery(
    ['studentEvaluation', id],
    () => markingService.getStudentEvaluationById(id),
    { enabled },
  );
}

export function getallStudentAnswersInEvaluation(
  studentId: string,
  evaluationId: string,
) {
  return useQuery(['studentEvaluation', studentId, evaluationId], () =>
    markingService.getallStudentAnswersInEvaluation(studentId, evaluationId),
  );
}

export function getEvaluationStudentEvaluations(id: string) {
  return useQuery(['evaluation/studentEvaluations', id], () =>
    markingService.getAllStudentEvaluationsByEvaluation(id),
  );
}

export function getEvaluationStudentSubmissions(id: string) {
  return useQuery(
    ['evaluation/studentEvaluations', id],
    () => markingService.getAllEvaluationStudentSubmissions(id),
    {
      enabled: !!id && id !== 'undefined' && id !== 'null',
    },
  );
}
