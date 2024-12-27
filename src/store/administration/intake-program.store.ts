import { useMutation, useQuery } from 'react-query';

import { intakeProgramService } from '../../services/administration/IntakeProgram.service';
import { StudentApproval } from '../../types/services/enrollment.types';
import { IntakeModuleStatus } from '../../types/services/intake-program.types';

class IntakeProgramStore {
  getIntakeProgramId(intakeProgramId: string) {
    return useQuery(['intake-program/id', intakeProgramId], () =>
      intakeProgramService.getIntakeProgramId(intakeProgramId),
    );
  }
  getStudentById(studentId: string) {
    return useQuery(['student/id', studentId], () =>
      intakeProgramService.getStudentById(studentId),
    );
  }
  getStudentsByIntakeProgram(intakeProgramId: string) {
    return useQuery(['students/intakeProgramId', intakeProgramId], () =>
      intakeProgramService.getStudentsByIntakeProgram(intakeProgramId),
    );
  }
  getStudentsByIntakeProgramByStatus(intakeProgramId: string, status: StudentApproval) {
    return useQuery(['students/intakeProgramId/status', intakeProgramId, status], () =>
      intakeProgramService.getStudentsByIntakeProgramByStatus(intakeProgramId, status),
    );
  }
  getStudentsByIntakeProgramLevel(intakeProgramlevelId: string, enabled: boolean = true) {
    return useQuery(
      ['students/intakeProgramlevelId', intakeProgramlevelId],
      () => intakeProgramService.getStudentsByIntakeProgramLevel(intakeProgramlevelId),
      {
        enabled,
      },
    );
  }
  getInstructorsByIntakeProgram(intakeProgramId: string) {
    return useQuery(
      ['instructors/intakeprogramId', intakeProgramId],
      () => intakeProgramService.getInstructorsByIntakeProgram(intakeProgramId),
      {
        enabled: !!intakeProgramId && intakeProgramId !== 'undefined',
      },
    );
  }
  getIntakeProgramLevelsByInstructorId(instructorId: string) {
    return useQuery(['instructors/intakeprogram', instructorId], () =>
      intakeProgramService.getIntakeProgramLevelsByInstructorId(instructorId),
    );
  }

  getModulesByInstructorAndStatus(instructorId: string, status: IntakeModuleStatus) {
    return useQuery(['instructor/modules', instructorId], () =>
      intakeProgramService.getModulesByInstructorAndStatus(instructorId, status),
    );
  }

  getStudentsByAcademy(academyId: string) {
    return useQuery(['students/academyId', academyId], () =>
      intakeProgramService.getStudentsByAcademy(academyId),
    );
  }
  getLevelsByIntakeProgram(intakeProgramId: string, enabled: boolean = true) {
    return useQuery(
      ['levels/intakeProgramId', intakeProgramId],
      () => intakeProgramService.getLevelsByIntakeProgram(intakeProgramId),
      { enabled },
    );
  }
  getIntakeLevelById(levelId: string) {
    return useQuery(['levels/intake', levelId], () =>
      intakeProgramService.getIntakeLevelById(levelId),
    );
  }

  getPeriodsByLevel(levelId: number, enabled: boolean = true) {
    return useQuery(
      ['levels/periods', levelId],
      () => intakeProgramService.getPeriodsByIntakeAcademicYearLevelId(levelId),
      {
        enabled: !!levelId,
      },
    );
  }

  getClassSubjects(classId: string, periodId: string) {
    return useQuery(['subjects/period/class', classId, periodId], () =>
      intakeProgramService.getClassSubjects(classId, periodId),
    );
  }

  addLevelsToIntakeProgram() {
    return useMutation(intakeProgramService.addLevelsToIntakeProgram);
  }
  addLevelToIntakeProgram() {
    return useMutation(intakeProgramService.addLevelToIntakeProgram);
  }
  addPeriodsToLevel() {
    return useMutation(intakeProgramService.addPeriodsToLevel);
  }
  addModuleToLevel() {
    return useMutation(intakeProgramService.addModuleToLevel);
  }
  addSubjectToPeriod() {
    return useMutation(intakeProgramService.addSubjectToPeriod);
  }
  removeStudentInLevel() {
    return useMutation(intakeProgramService.removeStudentInLevel);
  }
  editModuleToLevel() {
    return useMutation(intakeProgramService.editModuleToLevel);
  }
}

export function getModuleByintakeProgramModuleLevelId(
  intakeProgramModuleLevelId: string,
) {
  return useQuery(
    ['modules/intakeProgramModuleLevelId', intakeProgramModuleLevelId],
    () =>
      intakeProgramService.getModuleByintakeProgramModuleLevelId(
        intakeProgramModuleLevelId,
      ),
    { enabled: !!intakeProgramModuleLevelId },
  );
}

export function getStudentShipByUserId(userId: string) {
  return useQuery(
    ['studentShip/userId', userId],
    () => intakeProgramService.getStudentShipByUserId(userId),
    { enabled: !!userId },
  );
}

export function getIntakeProgramsByStudent(studentId: string) {
  return useQuery(
    ['intakeProgram/studentId', studentId],
    () => intakeProgramService.getIntakeProgramsByStudent(studentId),
    { enabled: !!studentId },
  );
}

export function getStudentLevels(studentId: string) {
  return useQuery(
    ['levels/student', studentId],
    () => intakeProgramService.getStudentLevels(studentId),
    { enabled: !!studentId },
  );
}

export function getModulesByLevel(levelId: number) {
  return useQuery(
    ['levels/modules', levelId],
    () => intakeProgramService.getModulesByIntakeAcademicYearLevelId(levelId),
    { enabled: !!levelId },
  );
}

export default new IntakeProgramStore();
