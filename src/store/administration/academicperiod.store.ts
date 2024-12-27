import { useMutation, useQuery } from 'react-query';

import { academicPeriodService } from '../../services/administration/academicperiods.service';

class AcademyPeriodStore {
  createAcademicPeriod() {
    return useMutation(academicPeriodService.createAcademicPeriod);
  }

  getAllPeriods() {
    return useQuery('academicPeriod', academicPeriodService.getAllPeriods);
  }

  getAcademicPeriodsByAcademicYear(academyId: string, enabled = true) {
    return useQuery(
      ['academicPeriod/years', academyId],
      () => academicPeriodService.getAcademicPeriodsByAcademicYear(academyId),
      {
        enabled,
      },
    );
  }

  getPeriodsByIntakeLevelId(id: string) {
    return useQuery(['academicPeriod/ilevel/id', id], () =>
      academicPeriodService.getPeriodsByIntakeLevelId(id),
    );
  }

  getAcademicPeriodById(id: string) {
    return useQuery(['academicPeriod/id', id], () =>
      academicPeriodService.getAcademicPeriodById(id),
    );
  }

  modifyAcademicPeriod() {
    return useMutation(academicPeriodService.modifyAcademicPeriod);
  }
}

export default new AcademyPeriodStore();
