import { AxiosResponse } from 'axios';

import { timetableAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  ICreateFootNote,
  ICreateTimeTableActivity,
  ICreateTimeTableWeek,
  ITimeTableActivityInfo,
  ITimeTableWeekInfo,
  IUpdateTimetableActivity,
  TimetableStatus,
} from '../../types/services/schedule.types';

type ChangeStatusType = {
  id: string;
  status: TimetableStatus;
};

class TimetableService {
  public async createLevelTimetable(
    tt: ICreateTimeTableActivity,
  ): Promise<AxiosResponse<Response<ITimeTableActivityInfo>>> {
    return await timetableAxios.post('/weekly-timetable-activity', tt);
  }

  public async createLevelTimetableFootnote(
    tt: ICreateFootNote,
  ): Promise<AxiosResponse<Response<ITimeTableActivityInfo>>> {
    return await timetableAxios.post('/activity-footnotes', tt);
  }

  public async getClassTimetableByIntakeLevelClass(
    intakeLevelClassId: string,
  ): Promise<AxiosResponse<Response<ITimeTableActivityInfo[]>>> {
    return await timetableAxios.get(
      `/class-timetable/intake-level-class/${intakeLevelClassId}`,
    );
  }

  public async getTimetableActivityById(
    id: string,
  ): Promise<AxiosResponse<Response<ITimeTableActivityInfo>>> {
    return await timetableAxios.get(`/weekly-timetable-activity/${id}`);
  }

  public async updateTimetableActivityById(
    tt: IUpdateTimetableActivity,
  ): Promise<AxiosResponse<Response<ITimeTableActivityInfo>>> {
    return await timetableAxios.put(`/weekly-timetable-activity/${tt.id}`, tt);
  }

  public async deleteActivity(
    id: string,
  ): Promise<AxiosResponse<Response<ITimeTableActivityInfo>>> {
    return await timetableAxios.delete(`/weekly-timetable-activity/${id}`);
  }

  // timetable weeks

  public async createTimetableWeek(
    tt: ICreateTimeTableWeek,
  ): Promise<AxiosResponse<Response<ITimeTableWeekInfo>>> {
    return await timetableAxios.post('/weekly-timetable', tt);
  }

  public async getWeekById(
    id: string,
  ): Promise<AxiosResponse<Response<ITimeTableWeekInfo>>> {
    return await timetableAxios.get(`/weekly-timetable/${id}`);
  }

  public async getActivitiesByWeekId(
    id: string,
  ): Promise<AxiosResponse<Response<ITimeTableWeekInfo>>> {
    return await timetableAxios.get(`/weekly-timetable/${id}`);
  }

  public async getCurrentWeek(
    currentDate: string,
    intakeLevelId: string,
  ): Promise<AxiosResponse<Response<ITimeTableWeekInfo>>> {
    return await timetableAxios.put(`/weekly-timetable/getCurrent/${intakeLevelId}`, {
      currentDate,
    });
  }

  public async getWeeksByIntakeLevel(
    intakeLevelId: string,
  ): Promise<AxiosResponse<Response<ITimeTableWeekInfo[]>>> {
    return await timetableAxios.get(`/weekly-timetable/intakeLevel/${intakeLevelId}`);
  }

  public async changeWeekStatus({
    id,
    status,
  }: ChangeStatusType): Promise<AxiosResponse<Response<ITimeTableWeekInfo>>> {
    return await timetableAxios.put(`/weekly-timetable/${id}/change-status/${status}`);
  }

  public async deleteWeek(
    id: string,
  ): Promise<AxiosResponse<Response<ITimeTableWeekInfo>>> {
    return await timetableAxios.delete(`/weekly-timetable/${id}`);
  }
}

export const timetableService = new TimetableService();
