import { useMutation, useQuery } from 'react-query';

import { academyService } from '../../services/administration/academy.service';

class AcademyStore {
  createAcademy() {
    return useMutation(academyService.createAcademy);
  }

  addLogo() {
    return useMutation(academyService.addAcademyLogo);
  }
  fetchAcademies() {
    return useQuery('academies', academyService.fetchAcademies);
  }
  getAcademiesByInstitution(institutionId: string) {
    return useQuery(['academies/instutionId', institutionId], () =>
      academyService.getAcademiesByInstitution(institutionId),
    );
  }

  getAcademyById(id: string, enabled = true) {
    return useQuery(['academies/id', id], () => academyService.getAcademyById(id), {
      enabled,
    });
  }

  modifyAcademy() {
    return useMutation(academyService.modifyAcademy);
  }
}

export default new AcademyStore();
