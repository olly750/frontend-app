import { AxiosResponse } from 'axios';

import { timetableAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  CreateEventSchedule,
  DateRange,
  ScheduleInfo,
} from '../../types/services/schedule.types';

class ScheduleService {
  public async getAll(): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
    return await timetableAxios.get('/schedural');
  }

  public async getScheduleById(
    id: string,
  ): Promise<AxiosResponse<Response<ScheduleInfo>>> {
    return await timetableAxios.get(`/schedural/${id}`);
  }

  public async getAllByAcademicProgramIntakeLevel(
    academicProgramIntakeLevelId: string,
    range: DateRange,
  ): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
    return await timetableAxios.put(
      `/schedural/academic-program-intake-level/${academicProgramIntakeLevelId}`,
      range,
    );
  }

  // public async getAllByAcademicProgramIntakeLevelAndStatus(
  //   academicProgramIntakeLevelId: string,
  //   status: ScheduleStatus,
  // ): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
  //   return await timetableAxios.get(
  //     `/schedural/academic-program-intake-level/${academicProgramIntakeLevelId}/status/${status}`,
  //   );
  // }

  public async getAllByAcademicProgram(
    academicProgramId: string,
    range: DateRange,
  ): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
    return await timetableAxios.put(
      `/schedural/academic-program/${academicProgramId}`,
      range,
    );
  }

  // public async getAllByAcademicProgramAndStatus(
  //   academicProgramId: string,
  //   status: ScheduleStatus,
  // ): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
  //   return await timetableAxios.get(
  //     `schedural/academic-program/${academicProgramId}/status/${status}`,
  //   );
  // }

  public async getAllByIntakeLevelClass(
    intakeLevelClassId: string,
    range: DateRange,
  ): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
    return await timetableAxios.put(
      `/schedural/intake-level-class/${intakeLevelClassId}`,
      range,
    );
  }

  public async getAllByStudent(
    studentId: string,
    range: DateRange,
  ): Promise<AxiosResponse<Response<ScheduleInfo[]>>> {
    return await timetableAxios.put(`/schedural/student/${studentId}`, range);
  }

  public async createDateRangeEvents(
    schedule: CreateEventSchedule,
  ): Promise<AxiosResponse<Response<ScheduleInfo>>> {
    return await timetableAxios.post('/schedural/date-range-events', schedule);
  }

  public async createOneTimeEvents(
    schedule: CreateEventSchedule,
  ): Promise<AxiosResponse<Response<ScheduleInfo>>> {
    return await timetableAxios.post('/schedural/one-time-events', schedule);
  }
  public async createRecurringEvents(
    schedule: CreateEventSchedule,
  ): Promise<AxiosResponse<Response<ScheduleInfo>>> {
    return await timetableAxios.post('/schedural/recurring-events', schedule);
  }

  public async modifySchedule(
    schedule: ScheduleInfo,
  ): Promise<AxiosResponse<Response<ScheduleInfo>>> {
    return await timetableAxios.put(`/schedural/${schedule.id}`, schedule);
  }
}

export const calendarService = new ScheduleService();
