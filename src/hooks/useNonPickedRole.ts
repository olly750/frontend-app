import { useEffect, useState } from 'react';

import { RoleResWithPrevilages } from '../types';
import cookie from '../utils/cookie';
import useAuthenticator from './useAuthenticator';

export default function useNonPickedRole() {
  const { user } = useAuthenticator();
  const [non_picked_role_cookie] = useState(cookie.getCookie('user_role') || '');
  const [non_picked_role, setNonPickedRole] = useState<RoleResWithPrevilages[] | []>([]);

  useEffect(() => {
    setNonPickedRole(
      user?.user_roles?.filter((role) => role.id + '' !== non_picked_role_cookie) || [],
    );
  }, [non_picked_role_cookie, user?.user_roles]);

  return non_picked_role;
}
