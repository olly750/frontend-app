import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { IAcademyDepartmentStats } from '../../types/services/stats.types';

class StatsService {
  public async getDepartmentStatsByAcademy(
    academyId?: string,
  ): Promise<AxiosResponse<Response<IAcademyDepartmentStats[]>>> {
    return await adminstrationAxios.get(
      `/statistics/departmentStatsByAcademy/${academyId}`,
    );
  }
}

export const statsService = new StatsService();
