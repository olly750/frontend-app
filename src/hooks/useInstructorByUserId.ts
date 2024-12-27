import { useEffect, useState } from 'react';

import { getInstructorByUserId } from '../store/instructordeployment.store';
import { Instructor } from '../types/services/instructor.types';

export function useInstructorByUserId(userId: string) {
  const [user, setUser] = useState<Instructor[]>();

  const userInfo = getInstructorByUserId(userId).data?.data.data;

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  return user;
}
