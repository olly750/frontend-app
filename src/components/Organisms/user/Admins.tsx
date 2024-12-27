import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { Privileges, ValueType } from '../../../types';
import { UserType, UserTypes } from '../../../types/services/user.types';
import Permission from '../../Atoms/auth/Permission';
import Button from '../../Atoms/custom/Button';
import NoDataAvailable from '../../Molecules/cards/NoDataAvailable';
import Table from '../../Molecules/table/Table';
import TableHeader from '../../Molecules/table/TableHeader';

export default function Admins({ admins }: { admins: UserTypes[] }) {
  const history = useHistory();
  const { t } = useTranslation();

  function handleSearch(_e: ValueType) {}

  const adminActions = [
    { name: 'Add Role', handleAction: () => {} },
    {
      name: 'Edit ' + t('Admins'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/users/${id}/edit`); // go to edit user
      },
    },
    {
      name: 'View ' + t('Admins'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/user/${id}/profile`); // go to view user profile
      },
    },
  ];
  return (
    <>
      <TableHeader
        title="Admins"
        totalItems={admins && admins.length > 0 ? admins.length : 0}
        handleSearch={handleSearch}
        showSearch={admins && admins.length > 0}>
        <Permission privilege={Privileges.CAN_CREATE_USER}>
          <div className="flex gap-3">
            <div className="flex gap-3">
              <Link to={`/dashboard/users/add/${UserType.ADMIN}`}>
                <Button>New {t('Admins')}</Button>
              </Link>
            </div>
          </div>
        </Permission>
      </TableHeader>
      {admins && (
        <div className="pt-8">
          {admins.length <= 0 ? (
            <NoDataAvailable
              icon="user"
              buttonLabel={'Add new ' + t('Admins')}
              title={'No ' + t('Admin') + ' available'}
              handleClick={() => history.push(`/dashboard/users/add`)}
              description={'There are no ' + t('Admins') + ' added into the system yet.'}
              privilege={Privileges.CAN_CREATE_USER}
            />
          ) : (
            <Table<UserTypes>
              statusColumn="status"
              data={admins}
              actions={adminActions}
              hide={['id', 'user_type']}
              uniqueCol="id"
            />
          )}
        </div>
      )}
    </>
  );
}
