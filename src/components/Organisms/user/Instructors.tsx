import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Privileges, ValueType } from '../../../types';
import { UserType, UserTypes } from '../../../types/services/user.types';
import Permission from '../../Atoms/auth/Permission';
import Button from '../../Atoms/custom/Button';
import NoDataAvailable from '../../Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../Molecules/Popup';
import Table from '../../Molecules/table/Table';
import TableHeader from '../../Molecules/table/TableHeader';
import ImportUsers from './ImportUsers';

export default function Instructors({ instructors }: { instructors: UserTypes[] }) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { t } = useTranslation();

  function handleSearch(_e: ValueType) {}
  const instructorActions = [
    { name: 'Add Role', handleAction: () => {} },
    {
      name: 'Edit' + t('Instructor'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/users/${id}/edit`); // go to edit user
      },
    },
    {
      name: 'View' + t('Instructor'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/user/${id}/profile`); // go to view user profile
      },
    },
  ];

  return (
    <>
      <TableHeader
        title={t('Instructor')}
        totalItems={instructors && instructors.length > 0 ? instructors.length : 0}
        handleSearch={handleSearch}
        showSearch={instructors && instructors.length > 0}>
        <Permission privilege={Privileges.CAN_CREATE_USER}>
          <div className="flex gap-3">
            <Link to={`${url}/import`}>
              <Button styleType="outline">Import {t('Instructor')}</Button>
            </Link>
            <Link to={`/dashboard/users/add/${UserType.INSTRUCTOR}`}>
              <Button>New {t('Instructor')}</Button>
            </Link>
          </div>
        </Permission>
      </TableHeader>
      {instructors && (
        <div className="pt-8">
          {instructors.length <= 0 ? (
            <NoDataAvailable
              icon="user"
              buttonLabel={'Add new ' + t('Instructor')}
              title={'No ' + t('Instructor') + ' available'}
              handleClick={() => history.push(`/dashboard/users/add`)}
              description={
                'There are no ' + t('Instructor') + ' added into the system yet.'
              }
              privilege={Privileges.CAN_CREATE_USER}
            />
          ) : (
            <Table<UserTypes>
              statusColumn="status"
              data={instructors}
              actions={instructorActions}
              hide={['id', 'user_type']}
              uniqueCol="id"
            />
          )}
        </div>
      )}
      <Switch>
        <Route
          exact
          path={`${url}/import`}
          render={() => (
            <PopupMolecule
              title={'Import' + t('Instructor')}
              open={true}
              onClose={history.goBack}>
              <ImportUsers userType={UserType.INSTRUCTOR} />
            </PopupMolecule>
          )}
        />
      </Switch>
    </>
  );
}
