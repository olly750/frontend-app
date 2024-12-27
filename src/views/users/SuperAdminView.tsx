import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import AssignRole from '../../components/Organisms/forms/roles/AssignRole';
import ActivateAccount from '../../components/Organisms/forms/user/ActivateAccount';
import usePickedRole from '../../hooks/usePickedRole';
import { authenticatorStore } from '../../store/administration';
import usersStore from '../../store/administration/users.store';
import { Privileges, RoleType, ValueType } from '../../types';
import { ActionsType } from '../../types/services/table.types';
import { UserType, UserTypes } from '../../types/services/user.types';
import { formatUserTable } from '../../utils/array';
import DeployInstructors from '../DeployInstructors';
import EnrollStudents from '../EnrollStudents';
import ViewUserRole from '../roles/ViewUserRole';

export default function SuperAdminView() {
  const { url, path } = useRouteMatch();
  const picked_role = usePickedRole();
  const history = useHistory();
  const [value, setValue] = useState('');
  const { mutateAsync } = authenticatorStore.resetPassword();

  const [currentPage, setcurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, isLoading, refetch } = usersStore.fetchUsers({
    userType: UserType.SUPER_ADMIN,
    page: currentPage,
    pageSize,
    sortyBy: 'username',
  });

  const { t } = useTranslation();

  const [users, setUsers] = useState<UserTypes[]>([]);

  useEffect(() => {
    const rankedStudents =
      data?.data.data.content.filter((inst) => inst.person?.current_rank) || [];
    const unrankedStudents =
      data?.data.data.content.filter(
        (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedStudents.sort(function (a, b) {
      if (a.person && b.person) {
        return a.person.current_rank?.priority - b.person.current_rank?.priority;
      } else {
        return 0;
      }
    });

    const finalStudents = rankedStudents.concat(unrankedStudents);

    setUsers(formatUserTable(finalStudents || []));
    setTotalElements(data?.data.data.totalElements || 0);
    setTotalPages(data?.data.data.totalPages || 0);
  }, [data]);

  let actions: ActionsType<UserTypes>[] = [];
  actions?.push({
    name: 'View Super Admin',
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/user/${id}/profile`); // go to view user profile
    },
    privilege: Privileges.CAN_ACCESS_USERS,
  });
  actions?.push({
    name: 'Edit super admin',
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/users/${id}/edit`); // go to edit user
    },
    privilege: Privileges.CAN_MODIFY_USER,
  });
  actions?.push({
    name: 'Deploy ' + t('Instructor'),
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
  },{
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
      setUsers(formatUserTable(data?.data.data.content || []));
      setTotalElements(data?.data.data.totalElements || 0);
      setTotalPages(data?.data.data.totalPages || 0);
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

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, refetch]);

  return (
    <div>
      <TableHeader
        title="Super Admins"
        totalItems={totalElements}
        handleSearch={handleSearch}
        handleClick={handleClick}>
        {picked_role?.type === RoleType.INSTITUTION && (
          <Permission privilege={Privileges.CAN_CREATE_USER}>
            <Link to={`/dashboard/users/add/${UserType.SUPER_ADMIN}`}>
              <Button>New Super Admin</Button>
            </Link>
          </Permission>
        )}
      </TableHeader>

      {isLoading ? (
        <Loader />
      ) : users.length <= 0 ? (
        <NoDataAvailable
          icon="user"
          buttonLabel="Add new super admin"
          title={'No super admin available'}
          handleClick={() => history.push(`/dashboard/users/add/${UserType.SUPER_ADMIN}`)}
          description="There are no super admins added into the system yet"
          privilege={Privileges.CAN_CREATE_USER}
        />
      ) : (
        <Table<UserTypes>
          statusColumn="status"
          data={users}
          actions={actions}
          statusActions={[]}
          hide={['id', 'user_type']}
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
      </Switch>
    </div>
  );
}
