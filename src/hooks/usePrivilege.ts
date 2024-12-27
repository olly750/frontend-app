import { Privileges } from '../types';
import cookie from '../utils/cookie';
import useAuthenticator from './useAuthenticator';

export function usePrivilege(privilege: Privileges) {
  const { user } = useAuthenticator();
  const user_role_cookie = cookie.getCookie('user_role') || '';
  const user_role = user?.user_roles?.find((role) => role.id + '' === user_role_cookie);
  const user_privileges = user_role?.role_privileges?.map((role) => role.name);

  return user_privileges?.includes(privilege);
}
