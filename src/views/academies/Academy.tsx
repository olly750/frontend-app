import React from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { Link, Switch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import AssignAdminToAcademy from '../../components/Organisms/forms/academy/AssignAdminToAcademy';
import NewAcademy from '../../components/Organisms/forms/academy/NewAcademy';
import UpdateAcademy from '../../components/Organisms/forms/academy/UpdateAcademy';
import useAuthenticator from '../../hooks/useAuthenticator';
import academyStore from '../../store/administration/academy.store';
import usersStore from '../../store/administration/users.store';
import { Link as LinkList, Privileges } from '../../types';
import { GenericStatus, ValueType } from '../../types';
import { ActionsType } from '../../types/services/table.types';

type AcademyTypes = {
  id: number | string | undefined;
  'academy name': string;
  'academy incharge': string | undefined;
  'phone number': string;
  status: GenericStatus;
};

export default function Academy() {
  const { url, path } = useRouteMatch();
  const history = useHistory();

  const { user } = useAuthenticator();
  const { data, isLoading } = academyStore.getAcademiesByInstitution(
    user?.institution_id || '',
  );
  const list: LinkList[] = [
    { to: '/', title: 'Institution Admin' },
    { to: 'academies', title: 'Academies' },
  ];
  const academyInfo = data?.data.data;
  let academies: AcademyTypes[] = [];
  const users = usersStore.getUsersByInstitution(user?.institution_id + '');

  academyInfo?.map((obj) => {
    let { id, name, current_admin_id, phone_number, generic_status } = obj;
    let academy: AcademyTypes = {
      id: id,
      'academy name': name,
      'academy incharge': current_admin_id
        ? users.data?.data.data.find((admin) => admin.id === current_admin_id)
            ?.first_name +
            ' ' +
            users.data?.data.data.find((admin) => admin.id === current_admin_id)
              ?.last_name || ''
        : 'None',
      'phone number': phone_number,
      status: generic_status,
    };
    academies.push(academy);
  });

  function handleSearch(_e: ValueType) {}

  let academyActions: ActionsType<AcademyTypes>[] = [];

  academyActions?.push({
    name: 'Edit academy',
    handleAction: (id: string | number | undefined) => {
      history.push(`${path}/${id}/edit`); // go to edit academy
    },
    privilege: Privileges.CAN_MODIFY_ACADEMY,
  });

  academyActions?.push({
    name: 'Assign incharge',
    handleAction: (id: string | number | undefined) => {
      history.push(`${path}/${id}/assign`); // go to assign admin
    },
    privilege: Privileges.CAN_ASSIGN_ACADEMY_INCHARGE,
  });

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${path}`}
          render={() => (
            <>
              <section>
                <BreadCrumb list={list}></BreadCrumb>
              </section>
              <div>
                <TableHeader
                  title="Institution academies"
                  totalItems={academies.length}
                  showSearch={false}
                  handleSearch={handleSearch}>
                  <Permission privilege={Privileges.CAN_CREATE_ACADEMY}>
                    <Link to={`${url}/add`}>
                      <Button>New academy</Button>
                    </Link>
                  </Permission>
                </TableHeader>
              </div>

              {isLoading ? (
                <Loader />
              ) : academies.length === 0 ? (
                <NoDataAvailable
                  icon="academy"
                  fill={false}
                  buttonLabel="Add new academy"
                  title={'No academies available'}
                  handleClick={() => history.push(`${url}/add`)}
                  description="the academies are not yet created, click below to create new ones"
                  privilege={Privileges.CAN_CREATE_ACADEMY}
                />
              ) : (
                <div>
                  {academyInfo && (
                    <Table<AcademyTypes>
                      statusColumn="status"
                      data={academies}
                      actions={academyActions}
                      hide={['id']}
                      uniqueCol="id"
                    />
                  )}
                </div>
              )}
            </>
          )}
        />
        {/* create academy */}
        <Route exact path={`${path}/add`} render={() => <NewAcademy />} />

        {/* modify academy */}
        <Route exact path={`${path}/:id/edit`} render={() => <UpdateAcademy />} />

        {/* assign admin to academy */}
        <Route
          exact
          path={`${path}/:id/assign`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Assign incharge of academy"
              open
              onClose={history.goBack}>
              <AssignAdminToAcademy />
            </PopupMolecule>
          )}
        />
      </Switch>
    </>
  );
}
