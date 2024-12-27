/* eslint-disable react-hooks/exhaustive-deps */
import './styles/redirecting.scss';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import useAuthenticator from './hooks/useAuthenticator';
import { useInstructorByUserId } from './hooks/useInstructorByUserId';
import usePickedRole from './hooks/usePickedRole';
import { useStudentByUserId } from './hooks/useStudentByUserId';
import { getPersonExperiences } from './store/administration/experience.store';
import { ProfileStatus } from './types/services/user.types';
import { chooseRole } from './utils/auth';
import { setLocalStorageData } from './utils/getLocalStorageItem';
import NotApproved from './views/NotApproved';

export default function Redirecting() {
  const [userHasNoRoles, setUserNoRoles] = useState(false);
  const { user } = useAuthenticator();
  const history = useHistory();
  const picked_role = usePickedRole();

  // const { data: nextOfKin } = getHisNextKinById(user?.id);
  const { data: experiences } = getPersonExperiences(user?.person?.id);
  const numofexperience = useMemo(
    () => experiences?.data.data.length,
    [experiences?.data.data],
  );

  const instructor = useInstructorByUserId(user?.id as string)?.find(
    (inst) => inst.academy.id === picked_role?.academy_id,
  );

  setLocalStorageData(
    'instructorInfo',
    useInstructorByUserId(user?.id.toString() || '')?.find(
      (inst) => inst.academy.id === picked_role?.academy_id,
    ) || {},
  );
  setLocalStorageData(
    'studentInfo',
    useStudentByUserId(user?.id.toString() || '')?.find(
      (stud) => stud.academy_id === picked_role?.academy_id,
    ) || {},
  )

  const redirectTo = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  useEffect(() => {
    async function prepareUserInformation() {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));

        if (user?.profile_status !== ProfileStatus.COMPLETD) {
          // console.log('jdsosds', user);
          redirectTo(`/complete-profile/${user.id}`);
        } else if (numofexperience != undefined) {
          if (numofexperience === 0) {
            return redirectTo(`/complete-experience`);
          } else if (numofexperience > 0) {
            if (user.user_roles) {
              if (user.user_roles.length === 1) {
                return chooseRole(user.user_roles[0]);
              } else return redirectTo('/choose-role');
            } else setUserNoRoles(true);
          }
        }

        // if (user?.profile_status !== ProfileStatus.COMPLETD) {
        //   redirectTo(`/complete-profile/${user.id}`);
        // } else if (nextOfKin?.data.data && experiences?.data.data) {
        //   if (nextOfKin?.data.data.length === 0) return redirectTo('/complete-more');
        //   else if (experiences?.data.data.length === 0)
        //     return redirectTo('/complete-experience');
        //   else if (user.user_roles) {
        //     if (user.user_roles.length === 1) {
        //       return chooseRole(user.user_roles[0]);
        //     } else return redirectTo('/choose-role');
        //   } else setUserNoRoles(true);
        // }
      }
    }

    prepareUserInformation();
  }, [user, numofexperience]);
  // }, [user, experiences?.data.data, nextOfKin?.data.data, redirectTo]);

  return (
    <>
      {userHasNoRoles ? (
        <NotApproved />
      ) : (
        <div className="redirecing-loader full-height grid place-items-center">
          <div className="typewriter text-xl font-bold w-44">
            <h1>Redirecting....</h1>
          </div>
        </div>
      )}
    </>
  );
}
