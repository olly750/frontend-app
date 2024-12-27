import { useMutation, useQuery } from 'react-query';

import { privilegeService } from '../../services';

class PrivilegeStore {
  modifyPrivilege() {
    return useMutation(privilegeService.modifyPrivilege);
  }
  getPrivileges() {
    return useQuery('privileges', privilegeService.getAllPrivileges);
  }
  getPrivilege(id: string) {
    return useQuery(['privilege/id', id], () => privilegeService.getPrivilege(id));
  }
  getPrivilegeBySearch(text: string, filter: boolean) {
    return useQuery(
      ['privileges/search', text],
      () => privilegeService.getPrivilegeBySearch(text),
      {
        enabled: Boolean(filter),
      },
    );
  }
}

export const privilegeStore = new PrivilegeStore();
