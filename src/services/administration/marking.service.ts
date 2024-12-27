import { AxiosResponse } from 'axios';

import { evaluationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { IEvaluationSectionBasedInfo } from '../../types/services/evaluation.types';
import {
  AnswerComment,
  IManualMarking,
  IManualMarkingInfo,
  MarkAllEvaluationQuestions,
  SingleFieldStudentMarker,
  StudentAnswerMarkInfo,
  StudentEvaluationInfo,
  StudentEvaluationSubmissionInfo,
  StudentMarkingAnswer,
} from '../../types/services/marking.types';

export async function saveAnswer(data: {
  data: AnswerComment;
  id: string;
}): Promise<AxiosResponse<Response<StudentMarkingAnswer>>> {
  return await evaluationAxios.put(
    `/student-answers/student-answer/${data.id}/commentAnswer`,
    data.data,
  );
}
export async function finishMarking(
  markInfo: MarkAllEvaluationQuestions,
): Promise<AxiosResponse<Response<String>>> {
  const correction = markInfo.correction;
  return await evaluationAxios.put(
    `/student-answers/markStudentEvaluation/${markInfo.studentEvaluation}`,
    { correction },
  );
}

export async function updateStudentAnswer(
  markInfo: StudentAnswerMarkInfo,
): Promise<AxiosResponse<Response<String>>> {
  return await evaluationAxios.put(
    `/student-answers/student-answer/${markInfo.answer_id}/markAnswer`,
    {
      marks: markInfo.marks,
    },
  );
}

export async function fieldMarkingFinish(
  markInfo: SingleFieldStudentMarker,
): Promise<AxiosResponse<Response<String>>> {
  return await evaluationAxios.post(`/studentEvaluations/marking/single-field-marker`, {
    ...markInfo,
  });
}

export async function publishResults(data: {
  evaluationId: string;
}): Promise<AxiosResponse<Response<String>>> {
  return await evaluationAxios.put(
    `/studentEvaluations/evaluation/${data.evaluationId}/publishResults`,
  );
}

export async function addManualMarking(
  data: IManualMarking,
): Promise<AxiosResponse<Response<IManualMarking[]>>> {
  return await evaluationAxios.post(
    `/studentEvaluations/marking/manual-marking/single-marker`,
    {
      ...data,
    },
  );
}

export async function getManualMarkingMarks(
  evaluationId: string,
  classId: string,
): Promise<AxiosResponse<Response<IManualMarkingInfo[]>>> {
  return await evaluationAxios.get(
    `/studentEvaluations/evaluation/${evaluationId}/class/${classId}`,
  );
}

export async function getallStudentAnswersInEvaluation(
  studentId: string,
  evaluationId: string,
): Promise<AxiosResponse<Response<[]>>> {
  return await evaluationAxios.get(
    `/student-answers/allStudentAnswers/${studentId}/narrowByEvaluation/${evaluationId}`,
  );
}

export async function publishResult(data: {
  studentEvaluationId: string;
}): Promise<AxiosResponse<Response<StudentEvaluationInfo>>> {
  return await evaluationAxios.put(
    `/studentEvaluations/studentEvaluation/${data.studentEvaluationId}/publish`,
  );
}

export async function finalizaMarkingWithRemarks(data: {
  studentEvaluationId: string;
  body: any;
}): Promise<AxiosResponse<Response<StudentEvaluationInfo>>> {
  return await evaluationAxios.post(
    `/studentEvaluations/studentEvaluation/${data.studentEvaluationId}/addRemark`,
    data.body,
  );
}

export async function getStudentEvaluationById(
  id: string,
): Promise<AxiosResponse<Response<StudentEvaluationInfo>>> {
  return await evaluationAxios.get(`/studentEvaluations/getById/${id}`);
}

export async function getStudentEvaluationAnswers(
  id: string,
): Promise<AxiosResponse<Response<StudentMarkingAnswer[]>>> {
  return await evaluationAxios.get(`/student-answers/getAllByStudentEvaluation/${id}`);
}

export async function getStudentEvaluationAnswersFeedback(
  id: string,
): Promise<AxiosResponse<Response<[]>>> {
  return await evaluationAxios.get(`/student-answers/instructor-feedback/getAttachmentsByAnswer/${id}`);
}


export async function getEvaluationMarkingModules(
  id: string,
): Promise<AxiosResponse<Response<IEvaluationSectionBasedInfo[]>>> {
  return await evaluationAxios.get(
    `/evaluation-module-subjects/getByEvaluation/${id}/marker`,
  );
}

export async function getAllStudentEvaluationsByEvaluation(
  id: string,
): Promise<AxiosResponse<Response<StudentEvaluationInfo[]>>> {
  return await evaluationAxios.get(`/studentEvaluations/getByEvaluation/${id}`);
}

export async function getAllEvaluationStudentSubmissions(
  id: string,
): Promise<AxiosResponse<Response<StudentEvaluationSubmissionInfo[]>>> {
  return await evaluationAxios.get(
    `/studentEvaluations/getSubmissionsByEvaluation/${id}`,
  );
}
