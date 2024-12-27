import React from 'react';
import { useParams } from 'react-router-dom';

import usersStore from '../../store/administration/users.store';
import { ParamType } from '../../types';
import UserRoleCard from '../users/profile/UserRoleCard';

export default function ViewUserRole() {
  const { id } = useParams<ParamType>();
  const { data: user } = usersStore.getUserById(id);
  return <>{user && <UserRoleCard user={user?.data.data} />}</>;
}
