import { useMutation, useQuery } from 'react-query';

import { deliberationService } from '../../services/evaluation/deliberation.service';

export function getEnrollmentByStudentAndLevel(
  level: string,
  studentId: string,
  enabled: boolean,
) {
  return useQuery(
    ['student/levelEnrollment', level, studentId],
    () =>
      deliberationService.getStudentEnrollmentByStudentAndLevel(
        Number(level),
        studentId + '',
      ),
    {
      enabled: enabled,
    },
  );
}

export function getLevelsByIntakeProgram(intakeProgramId: string) {
  return useQuery(
    ['levels/all_by_intake_program', intakeProgramId],
    () => deliberationService.getLevelsByIntakeProgram(intakeProgramId),
    { enabled: !!intakeProgramId },
  );
}

class DeliberationStore {
  getReportById(id: string) {
    return useQuery(['report/student', id], () => deliberationService.getReportByID(id), {
      enabled: !!id,
    });
  }

  updatePromotion() {
    return useMutation(deliberationService.updatePromotion);
  }
}

export const deliberationStore = new DeliberationStore();
