import { AxiosResponse } from 'axios';

import { evaluationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  DSAssessReport,
  IEditSubjectiveForm,
  IEvaluationMarkingProgressReport,
  IEvaluationPerformance,
  IModuleTermPerformance,
  InformativeReport,
  IOverallEvaluationStudentPerformance,
  IOverallLevelPerformance,
  IOverallStudentPerformance,
  ISubjective,
  ISubjectiveForm,
  MarkerSectionMarkingProgressReport,
  TwetForm,
  TwetReport,
} from '../../types/services/report.types';
import { DSAssessForm } from './../../types/services/report.types';

class SchoolReportService {
  public async getClassTermlyOverallReport(
    classId: string,
    academicYearPeriodId: string,
  ): Promise<AxiosResponse<Response<IOverallStudentPerformance[]>>> {
    return await evaluationAxios.get(
      `/reports/overall-report/class/${classId}/academic-year-period/${academicYearPeriodId}`,
    );
  }
  public async getClassTermlyEvaluationReport(
    classId: string,
    academicYearPeriodId: string,
  ): Promise<AxiosResponse<Response<IOverallEvaluationStudentPerformance[]>>> {
    return await evaluationAxios.get(
      `/reports/overall-evaluations-report/class/${classId}/academic-year-period/${academicYearPeriodId}`,
    );
  }
  public async getLevelTermlyOverallReport(
    yearPeriods: string,
  ): Promise<AxiosResponse<Response<IOverallLevelPerformance[]>>> {
    return await evaluationAxios.get(
      `/reports/overall-evaluations-report/level/${yearPeriods}/get-all`,
    );
  }

  public async getStudentReportInTerm(
    studentID: string,
    academicYearPeriodId: string,
  ): Promise<AxiosResponse<Response<IOverallStudentPerformance>>> {
    return await evaluationAxios.get(
      `/reports/student/${studentID}/term/${academicYearPeriodId}`,
    );
  }
  public async getStudentReportInLevel(
    studentID: string,
    YearPeriods: string,
  ): Promise<AxiosResponse<Response<IOverallStudentPerformance>>> {
    return await evaluationAxios.get(
      `reports/student/${studentID}/year-periods/${YearPeriods}`,
    );
  }

  public async getStudentInformativeReport(
    studentID: string,
    academicYearPeriodId: string,
  ): Promise<AxiosResponse<Response<InformativeReport>>> {
    return await evaluationAxios.get(
      `/reports/end-of-term-report/student/${studentID}/term/${academicYearPeriodId}`,
    );
  }

  public async getTewtReport(
    studentId: string,
    term: string,
  ): Promise<AxiosResponse<Response<TwetReport>>> {
    return await evaluationAxios.get(`/reports/tewt/student/${studentId}/term/${term}`);
  }

  public async getDSCriticsReport(
    term: number,
  ): Promise<AxiosResponse<Response<DSAssessReport[]>>> {
    return await evaluationAxios.get(`reports/course-critiques/term/${term}`);
  }

  public async getStudentFullReport(
    studentId: string,
  ): Promise<AxiosResponse<Response<IOverallStudentPerformance[]>>> {
    return await evaluationAxios.get(
      `/studentReport/getThreeTermSchoolReport/${studentId}`,
    );
  }

  public async getEvaluationPerformance(
    evaluationId: string,
  ): Promise<AxiosResponse<Response<IEvaluationPerformance[]>>> {
    return await evaluationAxios.get(`/reports/evaluation/${evaluationId}`);
  }

  public async getEvaluationMarkingProgressReport(
    evaluationId: string,
  ): Promise<AxiosResponse<Response<IEvaluationMarkingProgressReport>>> {
    return await evaluationAxios.post(`/reports/reports/getMarkingProgressReport`, null, {
      params: {
        evaluationId,
      },
    });
  }

  public async getModuleTermPerformance(
    moduleID: string,
    termID: string,
    classes: string,
  ): Promise<AxiosResponse<Response<IModuleTermPerformance[]>>> {
    return await evaluationAxios.get(
      `/reports/module/${moduleID}/term/${termID}/classes/${classes}`,
    );
  }
  public async createSubjective(
    subjective: ISubjectiveForm,
  ): Promise<AxiosResponse<Response<ISubjective>>> {
    return await evaluationAxios.post('reports/add-term-subjective', subjective);
  }
  public async addDSCritique(
    subjective: DSAssessForm,
  ): Promise<AxiosResponse<Response<DSAssessForm>>> {
    return await evaluationAxios.post('reports/course-critiques/add', subjective);
  }
  public async addTewt(tewt: TwetForm): Promise<AxiosResponse<Response<TwetReport>>> {
    return await evaluationAxios.post('reports/tewt/add', tewt);
  }
  public async editSubjective(
    subjective: IEditSubjectiveForm,
  ): Promise<AxiosResponse<Response<ISubjective>>> {
    return await evaluationAxios.put('reports/edit-subjective', subjective);
  }
}

export const reportService = new SchoolReportService();
