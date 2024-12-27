import { debounce } from 'lodash';
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
import ActivateAccount from '../../components/Organisms/forms/user/ActivateAccount';
import ImportUsers from '../../components/Organisms/user/ImportUsers';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { enrollmentService } from '../../services/administration/enrollments.service';
import { authenticatorStore } from '../../store/administration';
import academyStore from '../../store/administration/academy.store';
import { getStudentsByAcademyOrderedByRank } from '../../store/administration/enrollment.store';
import { Privileges, RoleType, ValueType } from '../../types';
import { ActionsType } from '../../types/services/table.types';
import { StudentTypes, UserType } from '../../types/services/user.types';
import { formatStudentTable } from '../../utils/array';
import { getDropDownOptions } from '../../utils/getOption';
import DeployInstructors from '../DeployInstructors';
import EnrollStudents from '../EnrollStudents';
import ViewUserRole from '../roles/ViewUserRole';

export default function StudentsView() {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const { mutateAsync } = authenticatorStore.resetPassword();
  const { t } = useTranslation();
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();

  const [selectedAcademy, setSelectedAcademy] = useState(picked_role?.academy?.id);
  const [currentPage, setcurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [isSearching, setIsSearching] = useState(false);

  const { data, isFetching } = getStudentsByAcademyOrderedByRank(selectedAcademy, {
    page: currentPage,
    pageSize,
  });

  const [students, setStudents] = useState<StudentTypes[]>([]);

  const academies = academyStore.getAcademiesByInstitution(
    user?.institution.id.toString() || '',
  );

  let actions: ActionsType<StudentTypes>[] = [
    {
      name: 'View ' + t('Students'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/user/${id}/profile`); // go to view user profile
      },
      privilege: Privileges.CAN_ACCESS_USERS,
    },
    {
      name: 'Edit ' + t('Students'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/users/${id}/edit`); // go to edit user
      },
      privilege: Privileges.CAN_MODIFY_USER,
    },
    {
      name: 'Deploy ' + t('Instructor'),
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/${id}/deploy`); // go to assign role
      },
      privilege: Privileges.CAN_CREATE_USER,
    },
    {
      name: 'Enroll ' + t('Students'),
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/${id}/enroll`); // go to assign role
      },
      privilege: Privileges.CAN_CREATE_USER,
    },
    {
      name: 'View Role',
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/${id}/view-role`); // go to assign role
      },
      privilege: Privileges.CAN_ACCESS_USERS_ROLES,
    },
    {
      name: 'Assign Role',
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/${id}/assign-role`); // go to assign role
      },
      privilege: Privileges.CAN_ASSIGN_ROLE,
    },
    {
      name: 'Reset Password',
      handleAction: (id: string | number | undefined) => {
        const toastId = toast.loading('Resetting password...');
        //call a reset password api
        mutateAsync(id?.toString() || '', {
          onSuccess: () => {
            toast.success('Password reset successfully', { duration: 5000, id: toastId });
          },
          onError: (_err: any) => {
            toast.error("Failed to reset password for this student's account", {
              id: toastId,
            });
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
    },
  ];

  const handleSearch = debounce(async (e: ValueType) => {
    if (e.value.toString().length === 0) {
      setStudents(formatStudentTable(data?.data.data.content || []));
      setcurrentPage(0);
      return;
    }

    try {
      setIsSearching(true);
      const resp = await enrollmentService.searchStudentsByAcademy(
        selectedAcademy || '',
        e.value.toString(),
        {
          pageSize: 100,
        },
      );

      setStudents(formatStudentTable(resp.data.data.content));
    } catch (error) {
      console.error(error);
    } finally {
      setcurrentPage(0);
      setIsSearching(false);
    }
  }, 300);

  //when picked role changes, update the selected academy
  useEffect(() => {
    if (picked_role) setSelectedAcademy(picked_role?.academy?.id);
  }, [picked_role]);

  // if data changes, format the data
  useEffect(() => {
    if (data?.data.data.content) {
      setStudents(formatStudentTable(data.data.data.content));
    }
  }, [data?.data.data]);

  return (
    <div>
      {picked_role?.type === RoleType.INSTITUTION && (
        <div className="flex items-center gap-4">
          <SelectMolecule
            width="80"
            className=""
            placeholder="Please select academy"
            loading={academies.isLoading}
            value={selectedAcademy}
            handleChange={(e) => {
              setSelectedAcademy(e.value.toString());
            }}
            name={'academy'}
            options={getDropDownOptions({ inputs: academies.data?.data.data || [] })}>
            Academy
          </SelectMolecule>
        </div>
      )}
      <TableHeader
        title={t('Students')}
        totalItems={data?.data.data.totalElements || 0}
        handleSearch={handleSearch}
        isSearching={isSearching}>
        <Permission privilege={Privileges.CAN_CREATE_USER}>
          <div className="flex gap-3">
            <Link to={`${url}/import`}>
              <Button styleType="outline">Import {t('Students')}</Button>
            </Link>
            <Link to={`${url}/add/${UserType.STUDENT}`}>
              <Button>New {t('Students')}</Button>
            </Link>
          </div>
        </Permission>
      </TableHeader>

      {isFetching ? (
        <Loader />
      ) : students.length == 0 ? (
        <NoDataAvailable
          icon="user"
          buttonLabel={'Add new student'}
          title={'No ' + t('Students') + ' available'}
          handleClick={() => history.push(`/dashboard/users/add/STUDENT`)}
          description={`There are no ${t('Students')} added into the system yet`}
          privilege={Privileges.CAN_CREATE_USER}
        />
      ) : (
        <Table<StudentTypes>
          statusColumn="status"
          data={students}
          actions={actions}
          statusActions={[]}
          hide={['id', 'user_type', 'ID Card']}
          selectorActions={[]}
          uniqueCol="id"
          rowsPerPage={pageSize}
          totalPages={data?.data.data.totalPages}
          currentPage={currentPage}
          onPaginate={(page) => setcurrentPage(page)}
          onChangePageSize={(size) => {
            setcurrentPage(currentPage);
            setPageSize(size);
          }}
        />
      )}

      <Switch>
        <Route
          exact
          path={`${url}/import`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Import students"
              open={true}
              onClose={history.goBack}>
              <ImportUsers userType={UserType.STUDENT} />
            </PopupMolecule>
          )}
        />
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
              title="Deploy as an instructor"
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
