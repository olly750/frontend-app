import { useMutation, useQuery } from 'react-query';

import { instructorDeployment } from '../services/administration/InstructorDeployment.service';
import { FilterOptions } from '../types';
import { formatQueryParameters } from '../utils/query';

class InstructorDeploymentStore {
  getInstructorsRegisteredInAcademy(academyId: string) {
    return useQuery(['instructor-deploy/academy', academyId], () =>
      instructorDeployment.getInstructorsRegisteredInAcademy(academyId),
    );
  }
  getInstructorById(id: string) {
    return useQuery(['instructor/id', id], () =>
      instructorDeployment.getInstructorById(id),
    );
  }

  getInstructors() {
    return useQuery(['instructors'], () => instructorDeployment.getInstructors());
  }

  deploy() {
    return useMutation(instructorDeployment.deploy);
  }

  getUsersByRanks() {
    return useMutation(instructorDeployment.getUsersSortedByRanks);
  }
}

export function getInstructorByAcademyOrderedByRank(
  academyId?: string,
  options?: FilterOptions,
) {
  return useQuery(
    ['instructor/academy', academyId, formatQueryParameters(options)],
    () => instructorDeployment.getInstructorByAcademyOrderedByRank(academyId, options),
    { enabled: !!academyId },
  );
}

export function getInstructorsDeployedInAcademy(academyId: string) {
  return useQuery(
    ['instructor-deploy/academy', academyId],
    () => instructorDeployment.getInstructorsDeployedInAcademy(academyId),
    { enabled: !!academyId },
  );
}

export function getInstructorByUserId(userId: string) {
  return useQuery(
    ['instructor/userId', userId],
    () => instructorDeployment.getInstructorByUserId(userId),
    { enabled: !!userId },
  );
}

export default new InstructorDeploymentStore();
