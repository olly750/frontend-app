import '../../translations/i18n';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Icon from '../../components/Atoms/custom/Icon';
import ILabel from '../../components/Atoms/Text/ILabel';
import TabNavigation from '../../components/Molecules/tabs/TabNavigation';
import NewUser from '../../components/Organisms/forms/user/NewUser';
import UpdateUser from '../../components/Organisms/forms/user/UpdateUser';
import usePickedRole from '../../hooks/usePickedRole';
import { RoleType } from '../../types';
import AdminsView from './AdminsView';
import InstructorsView from './InstructorsView';
import StudentsView from './StudentsView';
import SuperAdminView from './SuperAdminView';
export default function Users() {
  const { url, path } = useRouteMatch();
  const [userType, setUserType] = useState('Students');
  const { t } = useTranslation();
  const picked_role = usePickedRole();

  const tabs = [
    {
      label: t('Students'),
      href: `${url}`,
    },
    {
      label: t('Instructor'),
      href: `${url}/instructors`,
    },
    {
      label: t('Other users'),
      href: `${url}/others`,
    },
  ];

  if (picked_role?.type === RoleType.INSTITUTION) {
    tabs.push({
      label: 'Super Admins',
      href: `${url}/superadmins`,
    });
  }

  return (
    <div>
      <div className="flex flex-wrap justify-start items-center pt-1">
        <ILabel size="sm" color="gray" weight="medium">
          Institution Admin
        </ILabel>
        <Icon name="chevron-right" />

        <ILabel size="sm" color="gray" weight="medium">
          Users
        </ILabel>
        <Icon name="chevron-right" fill="gray" />
        <ILabel size="sm" color="primary" weight="medium">
          {userType}
        </ILabel>
      </div>
      <Switch>
        <Route exact path={`${path}/add/:userType`} component={NewUser} />
        <Route exact path={`${path}/:id/edit`} component={UpdateUser} />

        <Route
          path={`${path}`}
          render={() => {
            return (
              <TabNavigation
                tabs={tabs}
                onTabChange={(event) => setUserType(event.activeTabLabel)}>
                <Switch>
                  <Route
                    path={`${path}/instructors`}
                    render={() => <InstructorsView />}
                  />
                  <Route path={`${path}/others`} render={() => <AdminsView />} />
                  <Route path={`${path}/superadmins`} render={() => <SuperAdminView />} />
                  <Route path={`${path}`} render={() => <StudentsView />} />
                </Switch>
              </TabNavigation>
            );
          }}
        />
      </Switch>
    </div>
  );
}
