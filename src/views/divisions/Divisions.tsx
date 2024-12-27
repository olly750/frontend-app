import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';

import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import ILabel from '../../components/Atoms/Text/ILabel';
import TabNavigation from '../../components/Molecules/tabs/TabNavigation';
import Departments from '../../components/Organisms/divisions/Departments';
import Faculties from '../../components/Organisms/divisions/Faculties';
// import ViewDepartmentsInFaculty from './ViewDepartmentsInFaculty';

export default function Divisions() {
  const { url, path } = useRouteMatch();
  const location = useLocation();
  const { t } = useTranslation();
  const [fetchType, setFetchType] = useState<string>('');

  useEffect(() => {
    if (location.pathname === '/dashboard/divisions/departments') {
      setFetchType('DEPARTMENT');
    } else if (path === '/dashboard/divisions') {
      setFetchType('FACULTY');
    }
  }, [location.pathname, path]);

  const tabs = [
    {
      label: t('Faculty'),
      href: `${url}`,
    },
    {
      label: 'Department',
      href: `${url}/departments`,
    },
  ];

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
          {fetchType}
        </ILabel>
      </div>
      <div className="flex gap-2 items-center py-3">
        <Heading className="capitalize" fontSize="2xl" fontWeight="bold">
          {t('Division')}
        </Heading>
        {/* <Badge
          badgetxtcolor="main"
          badgecolor="primary"
          fontWeight="normal"
          className="h-6 w-9 flex justify-center items-center">
          3{/* {divisions.length} 
        </Badge> */}
      </div>

      <TabNavigation
        tabs={tabs}
        onTabChange={(event) => setFetchType(event.activeTabLabel)}>
        <Switch>
          <Route
            path={`${path}/departments`}
            render={() => {
              return <Departments fetchType={fetchType} />;
            }}
          />
          <Route
            path={`${path}`}
            render={() => {
              return <Faculties fetchType={fetchType} />;
            }}
          />
        </Switch>
      </TabNavigation>
    </div>
  );
}
