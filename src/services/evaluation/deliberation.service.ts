import { AxiosResponse } from 'axios';

import { adminstrationAxios, evaluationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { StudentEnrollmentLevel } from '../../types/services/enrollment.types';
import { LevelIntakeProgram } from '../../types/services/intake-program.types';
import {
  IOverallStudentPerformance,
  PromotionType,
} from '../../types/services/report.types';

class DeliberationService {
  public async getReportByID(
    id: string,
  ): Promise<AxiosResponse<Response<IOverallStudentPerformance>>> {
    return await evaluationAxios.get(`/reports/report/${id}`);
  }

  public async getStudentEnrollmentByStudentAndLevel(
    level: number,
    studentId: string,
  ): Promise<AxiosResponse<Response<StudentEnrollmentLevel>>> {
    return await adminstrationAxios.get(
      `/students/getStudentEnrlomentByAcademicYearProgramIntakeLevel/${studentId}/${level}`,
    );
  }

  public async getLevelsByIntakeProgram(
    academicProgramId: string,
  ): Promise<AxiosResponse<Response<LevelIntakeProgram[]>>> {
    return await adminstrationAxios.get(
      `/academicProgramIntakeLevels/getProgramLevelsByIntakeProgram/${academicProgramId}`,
    );
  }

  public async updatePromotion(
    promotion: PromotionType,
  ): Promise<AxiosResponse<Response<PromotionType>>> {
    await adminstrationAxios.put(
      '/students/changeStudentLevelEnrolmentStatus',
      promotion,
    );
    return await evaluationAxios.put(
      `reports/report/${promotion.id}/${promotion.promotion_status}`,
    );
  }
}

export const deliberationService = new DeliberationService();
