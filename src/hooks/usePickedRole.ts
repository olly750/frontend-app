import { useEffect, useState } from 'react';

import { RoleResWithPrevilages } from '../types';
import { AcademyInfo } from '../types/services/academy.types';
import { InstitutionInfo } from '../types/services/institution.types';
import cookie from '../utils/cookie';
import useAuthenticator from './useAuthenticator';

export default function usePickedRole() {
  const { user } = useAuthenticator();
  const [picked_role, setPickedRole] = useState<RoleResWithPrevilages | undefined>();

  const picked_role_cookie = cookie.getCookie('user_role') || '';

  useEffect(() => {
    let role = user?.user_roles?.find(
      (role) => role.id.toString() === picked_role_cookie,
    );

    if (role) {
      role = {
        ...role,
        academy: getCookieAcademy(),
        institution: getCookieInsitution(),
      };
    }

    setPickedRole(role);
  }, [picked_role_cookie, user?.user_roles]);

  return picked_role;
}

function getCookieAcademy() {
  let ac = localStorage.getItem('currentAcademy');
  if (!ac) return undefined;
  return JSON.parse(ac) as AcademyInfo;
}

function getCookieInsitution() {
  let ac = localStorage.getItem('currentInsitution');
  if (!ac) return undefined;
  return JSON.parse(ac) as InstitutionInfo;
}
