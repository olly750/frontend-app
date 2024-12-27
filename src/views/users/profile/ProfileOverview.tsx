import React from 'react';
import { useLocation } from 'react-router-dom';

import Permission from '../../../components/Atoms/auth/Permission';
import academyStore from '../../../store/administration/academy.store';
import usersStore from '../../../store/administration/users.store';
import { Privileges } from '../../../types';
import { AcademyInfo } from '../../../types/services/academy.types';
import { UserInfo } from '../../../types/services/user.types';
import AcademiesCard from './AcademiesCard';
import EducationBackgroundCard from './EducationBackgroundCard';
import NextOfKinCard from './NextOfKinCard';
import OtherDetailsCard from './OtherDetailsCard';
import PersonalInfoCard from './PersonalInfoCard';
import RankEnrollmentCard from './RankEnrollmentCard';
import UserRoleCard from './UserRoleCard';

function ProfileOverview({ user }: { user: UserInfo }) {
  const { search } = useLocation();
  const viewMyProfile = new URLSearchParams(search).get('me') || '';
  // const userAcademies: AcademyInfo[] = user.academy ? [user.academy] : [];
  const { data: userRoles } = usersStore.getUserRoles(user.id + '');
  const { data: academies } = academyStore.getAcademiesByInstitution(user.institution_id);

  const userAcademiesIds = userRoles?.data.data.map((usr) => usr.role.academy_id);
  const userAcademies: AcademyInfo[] =
    academies?.data.data.filter((ac) => userAcademiesIds?.includes(ac.id)) || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Permission
        privilege={Privileges.CAN_ACCESS_USERS_PERSONAL_INFO}
        ignorePrivilege={Boolean(viewMyProfile)}>
        <PersonalInfoCard user={user} />
      </Permission>
      <div className="flex flex-col gap-7">
        <AcademiesCard academies={userAcademies} />
        <Permission
          privilege={Privileges.CAN_ACCESS_USERS_NEXTOFKIN}
          ignorePrivilege={Boolean(viewMyProfile)}>
          <NextOfKinCard user={user} />
        </Permission>
        {user.person && <EducationBackgroundCard person={user.person} />}
      </div>
      <div className="flex flex-col gap-7">
        <Permission
          privilege={Privileges.CAN_ACCESS_USERS_RANKS}
          ignorePrivilege={Boolean(viewMyProfile)}>
          <RankEnrollmentCard user={user} />
        </Permission>
        <Permission
          privilege={Privileges.CAN_ACCESS_USERS_ROLES}
          ignorePrivilege={Boolean(viewMyProfile)}>
          <UserRoleCard user={user} />
        </Permission>
        <OtherDetailsCard user={user} />
      </div>
    </div>
  );
}

export default ProfileOverview;
