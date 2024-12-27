import { useMutation, useQuery } from 'react-query';

import { timetableService } from '../../services/timetable/timetable.service';

class TimetableStore {
  createTimetableActivity() {
    return useMutation(timetableService.createLevelTimetable);
  }

  createTimetableActivityFootnote() {
    return useMutation(timetableService.createLevelTimetableFootnote);
  }

  getClassTimetableByIntakeLevelClass(id: string) {
    return useQuery(['timetable/intakeclassid/:id', id], () =>
      timetableService.getClassTimetableByIntakeLevelClass(id),
    );
  }

  updateTimetableActivityById() {
    return useMutation(timetableService.updateTimetableActivityById);
  }

  deleteActivity() {
    return useMutation(timetableService.deleteActivity);
  }

  // timetable weeks

  createTimetableWeek() {
    return useMutation(timetableService.createTimetableWeek);
  }

  geTimetableWeekById(id: string) {
    return useQuery(['timetable/week/:id', id], () => timetableService.getWeekById(id));
  }

  getWeekAndActivitiesByWeekId(id: string) {
    return useQuery(['timetable/week/:id', id], () =>
      timetableService.getActivitiesByWeekId(id),
    );
  }

  getCurrentWeek(currentDate: string, intakeLevelId: string) {
    return useQuery(['timetable/week/current/:id', intakeLevelId], () =>
      timetableService.getCurrentWeek(currentDate, intakeLevelId),
    );
  }

  getWeeksByIntakeLevel(intakeLevelId: string) {
    return useQuery(['timetable/weeks', intakeLevelId], () =>
      timetableService.getWeeksByIntakeLevel(intakeLevelId),
    );
  }

  changeWeekStatus() {
    return useMutation(timetableService.changeWeekStatus);
  }

  deleteWeek() {
    return useMutation(timetableService.deleteWeek);
  }
}

export function getTimetableActivityById(id?: string) {
  return useQuery(
    ['timetable/:id', id],
    () => timetableService.getTimetableActivityById(id || ''),
    { enabled: !!id },
  );
}

export const timetableStore = new TimetableStore();
