import { useMutation, useQuery } from 'react-query';

import { calendarService } from '../../services/timetable/calendar.service';
import {
  CreateEventSchedule,
  DateRange,
  frequencyType,
} from '../../types/services/schedule.types';

class ScheduleStore {
  createEventSchedule() {
    return useMutation((schedule: CreateEventSchedule) => {
      switch (schedule.frequencyType) {
        case frequencyType.DATE_RANGE:
          return calendarService.createDateRangeEvents(schedule);
        case frequencyType.RECURRING:
          return calendarService.createRecurringEvents(schedule);
        default:
          return calendarService.createOneTimeEvents(schedule);
      }
    });
  }

  getScheduleById(id: string) {
    return useQuery(['schedules/id', id], () => calendarService.getScheduleById(id));
  }

  getAllSchedules() {
    return useQuery(['schedules'], calendarService.getAll);
  }

  getAllByAcademicProgram(id: string, range: DateRange) {
    return useQuery(['schedules/program/:id', id], () =>
      calendarService.getAllByAcademicProgram(id, range),
    );
  }

  getAllByAcademicProgramIntakeLevel(id: string, range: DateRange) {
    return useQuery(
      ['schedules/level-intake/:id', id],
      () => calendarService.getAllByAcademicProgramIntakeLevel(id, range),
      { enabled: !!id },
    );
  }

  getAllByIntakeLevelClass(id: string, range: DateRange) {
    return useQuery(
      ['schedules/intakeclass/:id', id],
      () => calendarService.getAllByIntakeLevelClass(id, range),
      { enabled: !!id },
    );
  }

  getAllByStudent(id: string | undefined, range: DateRange) {
    return useQuery(
      ['schedules/student/:id', id],
      () => calendarService.getAllByStudent(id || '', range),
      { enabled: !!id },
    );
  }

  updateSchedule() {
    return useMutation(calendarService.modifySchedule);
  }
}

export const scheduleStore = new ScheduleStore();
