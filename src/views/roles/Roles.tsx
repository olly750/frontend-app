import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
// import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewRole from '../../components/Organisms/forms/roles/NewRole';
import UpdateRole from '../../components/Organisms/forms/roles/UpdateRole';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { getRolesByAcademy, getRolesByInstitution } from '../../store/administration';
import academyStore from '../../store/administration/academy.store';
import { Privileges, RoleRes, RoleType } from '../../types';
import { ActionsType } from '../../types/services/table.types';
import { getDropDownOptions } from '../../utils/getOption';

interface FilteredRoles
  extends Pick<RoleRes, 'id' | 'name' | 'description' | 'type' | 'status'> {}

export default function Roles() {
  const { url, path } = useRouteMatch();
  const [roles, setRoles] = useState<FilteredRoles[]>();
  const history = useHistory();
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  const location = useLocation();
  const [selectedAcademy, setSelectedAcademy] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const academies = academyStore.getAcademiesByInstitution(
    user?.institution.id.toString() || '',
  );

  const { data, isSuccess, isLoading, refetch } = selectedInstitution
    ? getRolesByInstitution(selectedInstitution)
    : getRolesByAcademy(selectedAcademy);

  useEffect(() => {
    if (picked_role?.type !== RoleType.INSTITUTION) {
      setSelectedAcademy(picked_role?.academy_id || '');
    }
  }, [picked_role?.academy_id, picked_role?.type]);

  useEffect(() => {
    // filter data to display
    const filterdData: FilteredRoles[] = [];

    const institutionRoles = data?.data.data.filter(
      (role) => role.type === RoleType.INSTITUTION,
    );

    //loop through roles from institution if we selected an institution else loop through mixed roles
    const roles = selectedInstitution ? institutionRoles : data?.data.data;
    roles?.forEach((element) => {
      // if (element?.academy_id === picked_role?.academy_id) {
      filterdData.push(_.pick(element, ['id', 'name', 'description', 'type', 'status']));
      // }
    });

    data?.data.data && setRoles(filterdData);
  }, [data, picked_role?.academy_id, selectedInstitution, user]);

  // re fetch data whenever user come back on this page
  useEffect(() => {
    if (location.pathname === path || location.pathname === `${path}/`) {
      refetch();
    }
  }, [location, path, refetch]);

  //actions to be displayed in table
  let actions: ActionsType<FilteredRoles>[] | undefined = [];

  actions?.push({
    name: 'Edit role',
    handleAction: (id: string | number | undefined) => {
      history.push(`${path}/${id}/edit`); // go to edit role
    },
    privilege: Privileges.CAN_MODIFY_ROLES,
  });

  actions?.push({
    name: 'View role  ',
    handleAction: (id: string | number | undefined) => {
      history.push(`${path.replace(/roles/i, 'role')}/${id}/view`); // go to view role
    },
    privilege: Privileges.CAN_ACCESS_ROLES,
  });

  // const manyActions = [
  //   {
  //     name: 'Disable/Enable',
  //     handleAction: (data?: string[]) => {
  //       alert(`handling many at once ${data}`);
  //     },
  //   },
  // ];

  function submited() {
    // setOpen(false);
  }
  function handleSearch() {}

  function handleSelect(_selected: string[] | null) {}

  return (
    <main>
      <section>
        <TableHeader
          title="Roles"
          totalItems={roles && roles.length > 0 ? roles.length : 0}
          showSearch={false}
          handleSearch={handleSearch}>
          <div className="flex items-end">
            <Permission privilege={Privileges.CAN_CREATE_ROLES}>
              <Link to={`${url}/add`}>
                <Button>Add Role</Button>
              </Link>
            </Permission>
          </div>
        </TableHeader>
        {picked_role?.type === RoleType.INSTITUTION ? (
          <div className="flex items-center gap-4">
            <SelectMolecule
              width="80"
              className=""
              loading={academies.isLoading}
              value={academies.data?.data.data[0].id}
              handleChange={(e) => {
                setSelectedInstitution('');
                setSelectedAcademy(e.value.toString());
              }}
              name={'type'}
              options={getDropDownOptions({ inputs: academies.data?.data.data || [] })}
            />
            <div>
              <Button
                onClick={() =>
                  setSelectedInstitution(user?.institution.id.toString() || '')
                }
                styleType="outline">
                View institution roles
              </Button>
            </div>
          </div>
        ) : (
          <InputMolecule
            readOnly
            value={picked_role?.academy?.name}
            name={'academy_id'}
            placeholder={isLoading ? 'Loading academy...' : ''}>
            Academy
          </InputMolecule>
        )}
      </section>
      <section>
        {isLoading && <Loader />}
        {roles && roles.length > 0 && isSuccess ? (
          <Table<FilteredRoles>
            hide={['id']}
            handleSelect={handleSelect}
            statusColumn="status"
            data={roles}
            uniqueCol={'id'}
            actions={actions}
          />
        ) : isSuccess && roles?.length === 0 ? (
          <NoDataAvailable
            icon="role"
            privilege={Privileges.CAN_CREATE_ROLES}
            buttonLabel="Add new role"
            title={'No roles available'}
            handleClick={() => history.push(`${url}/add`)}
            description="There are no roles added yet. Click below to add some"
          />
        ) : null}
      </section>

      <Switch>
        {/* create role */}
        <Route
          exact
          path={`${path}/add`}
          render={() => {
            return (
              <PopupMolecule title="New Role" open={true} onClose={history.goBack}>
                <NewRole onSubmit={submited} />
              </PopupMolecule>
            );
          }}
        />

        {/* modify role */}
        <Route
          exact
          path={`${path}/:id/edit`}
          render={() => {
            return (
              <PopupMolecule title="Update Role" open onClose={history.goBack}>
                <UpdateRole onSubmit={submited} />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
    </main>
  );
}
