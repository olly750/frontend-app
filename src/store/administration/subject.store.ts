import { useMutation, useQuery } from 'react-query';

import { subjectService } from '../../services/administration/subject.service';

class SubjectStore {
  addSubject() {
    return useMutation(subjectService.addSubject);
  }
  getSubjects() {
    return useQuery('subjects', subjectService.getSubjects);
  }

  getSubject(id: string) {
    return useQuery(['subjects/id', id], () => subjectService.getSubject(id));
  }

  getSubjectsByModule(moduleId: string) {
    return useQuery(['subjects/moduleId', moduleId], () =>
      subjectService.getSubjectsByModule(moduleId),
    );
  }

  modifySubject() {
    return useMutation(subjectService.modifySubject);
  }
}

export const subjectStore = new SubjectStore();
