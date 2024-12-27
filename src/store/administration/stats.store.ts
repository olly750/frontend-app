import { useQuery } from 'react-query';

import { statsService } from '../../services/administration/stats.service';

export function getDepartmentStatsByAcademy(academyId?: string) {
  return useQuery(
    ['stats/academyId', academyId],
    () => statsService.getDepartmentStatsByAcademy(academyId),
    { enabled: !!academyId },
  );
}
