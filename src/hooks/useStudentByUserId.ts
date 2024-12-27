import { useEffect, useState } from 'react';

import { getStudentShipByUserId } from '../store/administration/intake-program.store';
import { Student } from '../types/services/user.types';

export function useStudentByUserId(userId: string) {
  const [user, setUser] = useState<Student[]>();

  const userInfo = getStudentShipByUserId(userId).data?.data.data;

  console.log('userInfo', userInfo);

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  return user;
}
