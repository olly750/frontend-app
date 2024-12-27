import { useMutation, useQuery } from 'react-query';

import { userNextKinService } from '../../services/administration/usernextkin.service';

class UserNextKinStore {
  createUserNextKin() {
    return useMutation(userNextKinService.createUserNextKin);
  }
  removeUserNextKin() {
    return useMutation(userNextKinService.removeUserNextKin);
  }
  getHisNextKinById(id: string) {
    return useQuery(['next/user_id', id], () => userNextKinService.getHisNextById(id));
  }
  getPersonByNid(nid: string) {
    return useQuery(['user/nid', nid], () => userNextKinService.getUserByNid(nid));
  }
}
export default new UserNextKinStore();

export function getHisNextKinById(id?: string | number) {
  return useQuery(
    ['next/user_id', id],
    () => userNextKinService.getHisNextById(id + ''),
    {
      enabled: !!id,
    },
  );
}
