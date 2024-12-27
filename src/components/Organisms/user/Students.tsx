import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';

import usePickedRole from '../../../hooks/usePickedRole';
import { GenericStatus, Privileges, ValueType } from '../../../types';
import { StudentApproval } from '../../../types/services/enrollment.types';
import { ActionsType, SelectorActionType } from '../../../types/services/table.types';
import { AcademyUserType, UserType, UserTypes } from '../../../types/services/user.types';
import Permission from '../../Atoms/auth/Permission';
import Button from '../../Atoms/custom/Button';
import NoDataAvailable from '../../Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../Molecules/Popup';
import Table from '../../Molecules/table/Table';
import TableHeader from '../../Molecules/table/TableHeader';
import ImportUsers from './ImportUsers';

export default function Students({
  students,
  showTableHeader = true,
  handleStatusAction,
  studentActions,
  enumtype,
  selectorActions,
}: {
  students: UserTypes[] | AcademyUserType[];
  showTableHeader?: boolean;
  handleStatusAction?: () => void;
  studentActions?: ActionsType<UserTypes | AcademyUserType>[];
  selectorActions?: SelectorActionType[];
  enumtype: string;
}) {

  console.log("student",students)
  const { url } = useRouteMatch();
  const history = useHistory();
  const [tempStud, setTemp] = useState([]);
  const picked_role = usePickedRole();
  function handleSearch(_e: ValueType) {}
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const studentStatActions = handleStatusAction
    ? enumtype === 'UserTypes'
      ? Object.keys(GenericStatus).map((stat) => ({
          name: stat,
          type: stat as GenericStatus,
          handleStatusAction: handleStatusAction,
        }))
      : Object.keys(StudentApproval).map((stat) => ({
          name: stat,
          type: stat as StudentApproval,
          handleStatusAction: handleStatusAction,
        }))
    : undefined;
  // useEffect(() => {
  //   if (hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)) {
  //     const temp = students.map((stud) => {
  //       return {
  //         ...stud,
  //         'full name': stud.alias_first_name + ' ' + stud.alias_last_name || '',
  //         email: '',
  //         username: '',
  //       };
  //     });
  //     // console.log(temp);

  //     // let tempStud: any = [];
  //     // students.forEach((stud) => {
  //     //   // console.log(stud);
  //     //   tempStud.push({
  //     //     ...stud,
  //     //     'full name': stud.alias_first_name + ' ' + stud.alias_last_name || '',
  //     //     email: '',
  //     //     username: '',
  //     //   });
  //     //   setTemp(tempStud);
  //     //   // console.log(tempStud);
  //     // });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // console.log(students);

  return (
    <>
      {showTableHeader && (
        <TableHeader
          title="Students"
          totalItems={students && students.length > 0 ? students.length : 0}
          handleSearch={handleSearch}
          showSearch={students && students.length > 0}>
          <Permission privilege={Privileges.CAN_CREATE_USER}>
            <div className="flex gap-3">
              <Link to={`${url}/import`}>
                <Button styleType="outline">Import students</Button>
              </Link>
              <Link to={`${url}/add/${UserType.STUDENT}`}>
                <Button>New student</Button>
              </Link>
            </div>
          </Permission>
        </TableHeader>
      )}
      {students && (
        <div className="pt-8">
          {students.length <= 0 ? (
            <NoDataAvailable
              icon="user"
              buttonLabel="Add new student"
              title={'No students available'}
              handleClick={() => history.push(`/dashboard/users/add`)}
              description="There are no students added into the system yet."
              privilege={Privileges.CAN_CREATE_USER}
            />
          ) : (
            <Table<UserTypes | any>
              statusColumn="status"
              data={
                hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
                  ? students.map((stud) => {
                      return {
                        ...stud,
                        'full name':
                          stud.alias_first_name + ' ' + stud.alias_last_name || '',
                        email: '',
                        username: '',
                      };
                    })
                  : students
              }
              actions={studentActions}
              statusActions={studentStatActions}
              hide={[
                'id',
                'intake_level_student',
                'user_type',
                'alias_last_name',
                'alias_first_name',
                'ID Card',
                'username',
                'email',
                'academy',
              ]}
              selectorActions={selectorActions}
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
              closeOnClickOutSide={false}
              title="Import students"
              open={true}
              onClose={history.goBack}>
              <ImportUsers userType={UserType.STUDENT} />
            </PopupMolecule>
          )}
        />
      </Switch>
    </>
  );
}
