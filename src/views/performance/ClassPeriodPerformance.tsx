import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { Privileges } from '../../types';
import AllDSAssessment from './AllDSAssessment';
import ClassEvaluationPerformance from './ClassEvaluationPerformance';
import ClassFullYearDeliberation from './ClassFullYearDeliberation';
import TermModulePerfomance from './TermModulePerfomance';

export default function ClassPeriodPerformance() {
  const { url, path } = useRouteMatch();

  const picked_role = usePickedRole();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  const tabs: TabType[] = [
    // { label: 'Performance per subject', href: url },
    { label: 'Performance per evaluation', href: `${url}` },
    { label: 'Performance per module', href: `${url}/by-module` },
    { label: 'Deliberation', href: `${url}/deliberation` },
    {
      label: 'DS Weekly Critics',
      href: `${url}/all-critics`,
      privilege: Privileges.CAN_RECEIVE_WEEKLY_CRITICS,
    },
  ];

  return (
    <TabNavigation tabs={tabs}>
      <Switch>
        {/* <Route path={`${path}`} exact component={OveralClassPerformance} /> */}
        {hasPrivilege(Privileges.CAN_RECEIVE_WEEKLY_CRITICS) && (
          <Route path={`${path}/all-critics`} component={AllDSAssessment} />
        )}
        <Route path={`${path}/deliberation`} component={ClassFullYearDeliberation} />
        <Route path={`${path}/by-module`} component={TermModulePerfomance} />
        <Route path={`${path}`} exact component={ClassEvaluationPerformance} />
      </Switch>
    </TabNavigation>
  );
}
