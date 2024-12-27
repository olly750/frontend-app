import { useMutation, useQuery } from 'react-query';

import { academicyearsService } from '../../services/administration/academicyears.service';

class AcademyStore {
  createAcademy() {
    return useMutation(academicyearsService.createAcademicYear);
  }

  fetchAcademicYears(academyId: string) {
    return useQuery(['academicyears', academyId], () =>
      academicyearsService.fetchAcademicYears(academyId),
    );
  }

  getAcademicYearById(id: string) {
    return useQuery(['academicyears/id', id], () =>
      academicyearsService.getAcademicYearById(id),
    );
  }

  modifyAcademy() {
    return useMutation(academicyearsService.modifyAcademicYear);
  }
}

export default new AcademyStore();
