import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import AssignRole from '../../components/Organisms/forms/roles/AssignRole';
import usePickedRole from '../../hooks/usePickedRole';
import ActivateAccount from '../../components/Organisms/forms/user/ActivateAccount';
import {
  authenticatorStore,
  getRolesByAcademy,
  getUsersByRole,
  roleStore,
} from '../../store/administration';
import academyStore from '../../store/administration/academy.store';
import usersStore from '../../store/administration/users.store';
import { Privileges, RoleType, ValueType } from '../../types';
import { ActionsType } from '../../types/services/table.types';
import { UserType, UserTypes } from '../../types/services/user.types';
import { formatUserTable } from '../../utils/array';
import { getDropDownOptions } from '../../utils/getOption';
import DeployInstructors from '../DeployInstructors';
import EnrollStudents from '../EnrollStudents';
import ViewUserRole from '../roles/ViewUserRole';

export default function AdminsView() {
  const picked_role = usePickedRole();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  const { mutateAsync } = authenticatorStore.resetPassword();

  const [currentPage, setcurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectedAcademy, setSelectedAcademy] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const roles = getRolesByAcademy(
    picked_role?.type === RoleType.INSTITUTION
      ? selectedAcademy
      : picked_role?.academy_id || '',
  );
  const { data: academies, isLoading: acLoading } =
    academyStore.getAcademiesByInstitution(picked_role?.institution_id.toString() || '');
  const { data: user_role, isLoading } = getUsersByRole(selectedRole, !!selectedRole);

  const [users, setUsers] = useState<UserTypes[]>([]);

  useEffect(() => {
    const rankedUsers =
      user_role?.data.data.filter((usr) => usr.user?.person?.current_rank) || [];
    const unrankedUsers =
      user_role?.data.data.filter(
        (usr) => usr !== rankedUsers.find((ranked) => ranked.id === usr.id),
      ) || [];

    rankedUsers.sort(function (a, b) {
      if (a.user.person && b.user.person) {
        return (
          a.user.person.current_rank?.priority - b.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    const finalUsers = rankedUsers.concat(unrankedUsers);
    const allUsers = finalUsers.map((usr) => usr.user);

    setUsers(formatUserTable(allUsers));
    // setTotalElements(user_role?.data.data.totalElements || 0);
    // setTotalPages(user_role?.data.data.totalPages || 0);
  }, [user_role?.data.data]);

  let actions: ActionsType<UserTypes>[] = [];

  actions?.push({
    name: 'View User',
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/user/${id}/profile`); // go to view user profile
    },
    privilege: Privileges.CAN_ACCESS_USERS,
  });
  actions?.push({
    name: 'Edit User',
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/users/${id}/edit`); // go to edit user
    },
    privilege: Privileges.CAN_MODIFY_USER,
  });

  actions?.push({
    name: 'Deploy as an ' + t('Instructor'),
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/deploy`); // go to assign role
    },
    privilege: Privileges.CAN_CREATE_USER,
  });

  actions?.push({
    name: 'Enroll student',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/enroll`); // go to assign role
    },
    privilege: Privileges.CAN_CREATE_USER,
  });

  actions?.push({
    name: 'View Role',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/view-role`); // go to assign role
    },
    privilege: Privileges.CAN_ACCESS_USERS_ROLES,
  });

  actions?.push({
    name: 'Assign Role',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/assign-role`); // go to assign role
    },
    privilege: Privileges.CAN_ASSIGN_ROLE,
  });

  actions?.push({
    name: 'Reset Password',
    handleAction: (id: string | number | undefined) => {
      //call a reset password api
      mutateAsync(id?.toString() || '', {
        onSuccess: () => {
          toast.success('Password reset successfully', { duration: 5000 });
        },
        onError: (error: any) => {
          toast.error(error + '');
        },
      });
    },
    privilege: Privileges.CAN_RESET_USER_PASSWORD,
  },
  {
    name: 'Activate / Deactivate',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/activate-deactivate`); // go to assign role
    },
    privilege: Privileges.CAN_RESET_USER_PASSWORD,
  },);
  

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  function handleSearch(_e: ValueType) {
    const value = _e.value + '';

    if (value.length === 0) {
      setUsers(formatUserTable(user_role?.data.data.map((user) => user.user) || []));
      // setTotalElements(user_role?.data.data.totalElements || 0);
      // setTotalPages(user_role?.data.data.totalPages || 0);
      setValue('');
      return;
    }

    setValue(value);
  }
  const [filter, setFilter] = useState(false);

  const handleClick = () => {
    setFilter(!filter);
  };

  // useEffect(() => {
  const { data: search } = usersStore.getAllBySearch(value, filter);

  useEffect(() => {
    if (filter && search) {
      setUsers(formatUserTable(search.data.data.content || []));
      setTotalElements(search.data.data.totalElements || 0);
      setTotalPages(search.data.data.totalPages || 0);
      setFilter(false);
    }
  }, [filter, search]);

  return (
    <div>
      <div className="flex items-center gap-4">
        <SelectMolecule
          width="80"
          className=""
          loading={acLoading}
          value={selectedAcademy}
          handleChange={(e) => {
            setSelectedAcademy(e.value.toString());
          }}
          name={'academy'}
          options={getDropDownOptions({
            inputs: academies?.data.data || [],
          })}>
          Academy
        </SelectMolecule>
        {(picked_role?.type === RoleType.ACADEMY || selectedAcademy) && (
          <SelectMolecule
            width="80"
            className=""
            loading={roles.isLoading}
            value={selectedRole}
            handleChange={(e) => {
              setSelectedRole(e.value.toString());
            }}
            name={'role'}
            options={getDropDownOptions({
              inputs: roles.data?.data.data || [],
            })}>
            Role
          </SelectMolecule>
        )}
      </div>

      {selectedRole ? (
        <>
          <TableHeader
            title={`${
              roles.data?.data.data.find((role) => role.id === parseInt(selectedRole))
                ?.name
            } users`}
            totalItems={totalElements}
            handleSearch={handleSearch}
            handleClick={handleClick}>
            <Permission privilege={Privileges.CAN_CREATE_USER}>
              <Link to={`/dashboard/users/add/${UserType.ADMIN}`}>
                <Button>
                  New user
                  {/* {t('Admins')} */}
                </Button>
              </Link>
            </Permission>
          </TableHeader>

          {isLoading ? (
            <Loader />
          ) : users.length <= 0 ? (
            <NoDataAvailable
              icon="user"
              buttonLabel={
                'Add a new user and assign a role to him/her'
                // + t('Admins')
              }
              title={'No users available'}
              handleClick={() => history.push(`/dashboard/users/add/${UserType.ADMIN}`)}
              description="There are no users with that role added into the system yet."
              privilege={Privileges.CAN_CREATE_USER}
            />
          ) : (
            <Table<UserTypes>
              statusColumn="status"
              data={users}
              actions={actions}
              statusActions={[]}
              hide={['id', 'user_type', 'ID Card']}
              selectorActions={[]}
              uniqueCol="id"
              rowsPerPage={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              onPaginate={(page) => setcurrentPage(page)}
              onChangePageSize={(size) => {
                setcurrentPage(0);
                setPageSize(size);
              }}
            />
          )}
        </>
      ) : null}

      <Switch>
        <Route
          exact
          path={`${path}/:id/assign-role`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Assign role"
              open={true}
              onClose={history.goBack}>
              <AssignRole />
            </PopupMolecule>
          )}
        />
                <Route
          exact
          path={`${path}/:id/activate-deactivate`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Change Account status"
              open={true}
              onClose={history.goBack}>
              <ActivateAccount />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/deploy`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title={'Deploy as an ' + t('Instructor')}
              open={true}
              onClose={history.goBack}>
              <DeployInstructors />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/enroll`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Enroll as a student"
              open={true}
              onClose={history.goBack}>
              <EnrollStudents />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/view-role`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Roles"
              open={true}
              onClose={history.goBack}>
              <ViewUserRole />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
