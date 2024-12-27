import 'react-calendar/dist/Calendar.css';
import '../../styles/components/Molecules/timetable/calendar.css';

import React, { useState } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import usePickedRole from '../../hooks/usePickedRole';
import { Privileges } from '../../types';
import IntakesView from '../../views/intakes/Intakes';
import Modules from '../../views/modules';
import AdminDashboard from './AdminDashboard';
import InstitutionDasboard from './InstitutionDasboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDasboard from './StudentDasboard';

export default function MainDashboard() {
  const picked_role = usePickedRole();

  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  return (
    <div className="py-2">
      {hasPrivilege(Privileges.CAN_ACCESS_ACADEMY_ADMIN_DASHOARD) && <AdminDashboard />}
      {hasPrivilege(Privileges.CAN_ACCESS_STUDENT_DASHBOARD) && <StudentDasboard />}
      {hasPrivilege(Privileges.CAN_ACCESS_INSTRUCTOR_DASHBOARD) && (
        <InstructorDashboard />
      )}
      {hasPrivilege(Privileges.CAN_ACCESS_INSTITUTION_DASHOARD) && (
        <InstitutionDasboard />
      )}
    </div>
  );
}
