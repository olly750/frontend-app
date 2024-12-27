import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';

import useAuthenticator from '../../../hooks/useAuthenticator';
import { getPrivilegesByRole } from '../../../store/administration';
import { Privileges } from '../../../types';
import cookie from '../../../utils/cookie';

interface IPermission {
  children: ReactNode;
  privilege: Privileges;
  ignorePrivilege?: boolean;
}

export default function Permission({
  children,
  privilege,
  ignorePrivilege = false,
}: IPermission) {
  const { user } = useAuthenticator();
  const [privileges, setPrivileges] = useState<string[]>();

  const picked_role_cookie = cookie.getCookie('user_role') || '';
  const { data: role_privilege } = getPrivilegesByRole(picked_role_cookie);

  useEffect(() => {
    const _privileges = role_privilege?.data.data?.map(
      (privilege) => privilege.privilege.name,
    );

    if (_privileges) setPrivileges(_privileges);
  }, [role_privilege?.data.data, user]);

  return <> {ignorePrivilege ? children : privileges?.includes(privilege) && children}</>;
}
