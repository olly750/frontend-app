import React from 'react';

import { AuthUser } from '../types/services/user.types';
import { RoleResWithPrevilages } from './../types/services/role.types';

interface IUserContext {
  user: AuthUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | undefined>>;
  picked_role: RoleResWithPrevilages | undefined;
  setPickedRole: React.Dispatch<React.SetStateAction<RoleResWithPrevilages | undefined>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export default React.createContext({
  user: undefined,
  setUser: () => {},
  setPickedRole: () => {},
  picked_role: undefined,
  theme: 'DEFAULT',
  setTheme: () => {},
} as IUserContext);
