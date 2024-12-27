import { useMutation, useQuery } from 'react-query';

import { classService } from '../../services/administration/class.service';

class ClassStore {
  addClass() {
    return useMutation(classService.addClass);
  }
  addClassStudent() {
    return useMutation(classService.addClassStudent);
  }
  modifyClass() {
    return useMutation(classService.modifyClass);
  }
  removeStudentInClass() {
    return useMutation(classService.removeStudentInClass);
  }
  getAllClasses() {
    return useQuery(['classes'], classService.getAllClasses);
  }
  getClassByPeriod(periodId: string, enabled: boolean = true) {
    return useQuery(
      ['class/periodId', periodId],
      () => classService.getClassByPeriod(periodId),
      { enabled },
    );
  }
  getClassByStudentAndLevel(studentId: string, levelId: string) {
    return useQuery(['class/studentId/levelId', studentId, levelId], () =>
      classService.getClassByStudentAndLevel(studentId, levelId),
    );
  }
}

export function getStudentsByClass(classId: string) {
  return useQuery(
    ['class/students', classId],
    () => classService.getStudentsByClass(classId),
    { enabled: !!classId },
  );
}

export function getClassById(classId: string) {
  return useQuery(['class/id', classId], () => classService.getClassById(classId), {
    enabled: !!classId,
  });
}
export const classStore = new ClassStore();
