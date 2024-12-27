import { useMutation, useQuery } from 'react-query';

import { diseaseService } from '../../services/administration/chronicdiseases.service';

class DiseaseStore {
  addDisease() {
    return useMutation(diseaseService.addDisease);
  }

  addChronicalDiseasesToPerson() {
    return useMutation(diseaseService.addChronicalDiseasesToPerson);
  }

  getDiseases() {
    return useQuery('disease', diseaseService.getAllDiseases);
  }

  getDisease(id: string) {
    return useQuery(['disease/id', id], () => diseaseService.getDisease(id));
  }

  modifyDisease() {
    return useMutation(diseaseService.ModifyDisease);
  }

  getUserDisease(id: string) {
    return useQuery(['user/disease/id', id], () => diseaseService.getUserDisease(id));
  }

  getPersonDisease(id: string) {
    return useQuery(['person/disease/id', id], () =>
      diseaseService.getPersonDiseases(id),
    );
  }
}

export default new DiseaseStore();
