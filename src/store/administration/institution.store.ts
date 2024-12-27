import { useMutation, useQuery } from 'react-query';

import { institutionService } from '../../services/administration/institution.service';

class InstitutionStore {
  create() {
    return useMutation(institutionService.create);
  }
  addLogo() {
    return useMutation(institutionService.addLogo);
  }
  getAll() {
    return useQuery('institutions', institutionService.fetchAll);
  }
  getInstitutionById(id: string) {
    return useQuery(['insitution/id', id], () =>
      institutionService.getInstitutionById(id),
    );
  }
  updateInstitution() {
    return useMutation(institutionService.update);
  }
}

export const institutionStore = new InstitutionStore();
