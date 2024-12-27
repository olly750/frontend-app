import { useMutation, useQuery } from 'react-query';

import { experienceService } from '../../services/administration/experience.service';

class ExperienceStore {
  create() {
    return useMutation(experienceService.create);
  }
  addFile() {
    return useMutation(experienceService.addFile);
  }

  downloadFile(materialId: string, enabled = true) {
    return useQuery(
      ['download/experience', materialId],
      () => experienceService.downloadFile(materialId),
      { enabled },
    );
  }
  getAll() {
    return useQuery('experiences', experienceService.fetchAll);
  }
  getExperienceById(id: string) {
    return useQuery(['experience/id', id], () => experienceService.getExperienceById(id));
  }
  getPersonExperiences(personId: string) {
    return useQuery(['experience/id', personId], () =>
      experienceService.findPersonExperiences(personId),
    );
  }
  update() {
    return useMutation(experienceService.update);
  }
}

export const experienceStore = new ExperienceStore();

export function getPersonExperiences(personId?: string | number) {
  return useQuery(
    ['experience/id', personId],
    () => experienceService.findPersonExperiences(personId + ''),
    { enabled: !!personId },
  );
}
