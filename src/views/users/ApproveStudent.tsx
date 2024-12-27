import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Table from '../../components/Molecules/table/Table';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { Privileges } from '../../types';
import { ApproveStudents, StudentApproval } from '../../types/services/enrollment.types';
import { IntakeProgParam } from '../../types/services/intake-program.types';
import { AcademyUserType } from '../../types/services/user.types';
import { titleCase } from '../../utils/getOption';

interface AcademyUser extends AcademyUserType {
  user_id: string;
}

function ApproveStudent() {
  const history = useHistory();
  const { intakeProg } = useParams<IntakeProgParam>();
  const [unselectAll, setUnselectAll] = useState(false);
  const { data: studentProg, isLoading } =
    intakeProgramStore.getStudentsByIntakeProgram(intakeProg);
  const [students, setStudents] = useState<AcademyUser[]>([]);

  useEffect(() => {
    let pushedStud: AcademyUser[] = [];

    const rankedStudents =
      studentProg?.data.data.filter((stud) => stud.student.user.person?.current_rank) ||
      [];
    const unrankedStudents =
      studentProg?.data.data.filter(
        (stud) => stud !== rankedStudents.find((ranked) => ranked.id === stud.id),
      ) || [];

    rankedStudents.sort(function (a, b) {
      if (a.student.user.person && b.student.user.person) {
        return (
          a.student.user.person.current_rank?.priority -
          b.student.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    const finalStudents = rankedStudents.concat(unrankedStudents);

    finalStudents?.map((stud) => {
      let { id, username, first_name, last_name, email, person, user_type } =
        stud.student.user;
      let student: AcademyUser = {
        id: stud.id,
        user_id: id + '',
        rank: person?.current_rank?.abbreviation,
        username: username,
        'full name': first_name + ' ' + last_name,
        email: email,
        'ID Card': person?.nid || '',
        user_type: user_type,
        status: stud.enrolment_status,
        alias_last_name: undefined,
        alias_first_name: undefined,
      };
      pushedStud.push(student);
    });

    setStudents(pushedStud);
  }, [studentProg?.data.data]);

  let pendingStud = students.filter((user) => user.status == StudentApproval.PENDING);
  let approvedStud = students.filter((user) => user.status == StudentApproval.APPROVED);
  let rejectedStud = students.filter((user) => user.status == StudentApproval.REJECTED);

  const { mutateAsync } = enrollmentStore.approveStudent();

  function approveStud(data?: string[]) {
    data?.map((st_id) => {
      let newStudent: ApproveStudents = {
        intake_program_student_id: parseInt(st_id),
        status: StudentApproval.APPROVED,
      };

      mutateAsync(newStudent, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['students/intakeProgramId']);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    });
  }

  function rejectStud(data?: string[]) {
    data?.map((st_id) => {
      let newStudent: ApproveStudents = {
        intake_program_student_id: parseInt(st_id),
        status: StudentApproval.REJECTED,
      };

      mutateAsync(newStudent, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['students/intakeProgramId']);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    });
  }

  // const studentActions = [
  //   {
  //     name: 'View Student',
  //     handleAction: (id: string | number | undefined) => {
  //       history.push(`/dashboard/user/${id}/profile`); // go to view user profile
  //     },
  //   },
  // ];

  return (
    <>
      <Tabs onTabChange={() => setUnselectAll(true)}>
        {Object.keys(StudentApproval).map((stud) => (
          <Tab key={stud} className="py-3" label={titleCase(stud)}>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="pt-2">
                {(stud === StudentApproval.PENDING
                  ? pendingStud.length
                  : stud === StudentApproval.APPROVED
                  ? approvedStud.length
                  : rejectedStud.length) <= 0 ? (
                  <NoDataAvailable
                    icon="user"
                    buttonLabel="Add new student"
                    showButton={false}
                    title={'No students available'}
                    handleClick={() => history.push(`/dashboard/users/add`)}
                    description="There are no new students waiting for approval"
                  />
                ) : (
                  <Table<AcademyUser>
                    statusColumn="status"
                    data={
                      stud === StudentApproval.PENDING
                        ? pendingStud
                        : stud === StudentApproval.APPROVED
                        ? approvedStud
                        : rejectedStud
                    }
                    actions={[
                      {
                        name: 'View Profile',
                        handleAction: (id: string | number | undefined) => {
                          stud === StudentApproval.PENDING
                            ? history.push({
                                pathname: `/dashboard/user/${
                                  pendingStud.find((st) => st.id === id)?.user_id
                                }/profile`,
                                search: `?intkStud=${id}&stat=${StudentApproval.PENDING}`,
                              })
                            : stud === StudentApproval.APPROVED
                            ? history.push({
                                pathname: `/dashboard/user/${
                                  approvedStud.find((st) => st.id === id)?.user_id
                                }/profile`,
                                search: `?intkStud=${id}&stat=${StudentApproval.APPROVED}`,
                              })
                            : history.push({
                                pathname: `/dashboard/user/${
                                  rejectedStud.find((st) => st.id === id)?.user_id
                                }/profile`,
                                search: `?intkStud=${id}&stat=${StudentApproval.REJECTED}`,
                              });
                        },
                        privilege: Privileges.CAN_ACCESS_PROFILE,
                      },
                    ]}
                    selectorActions={
                      stud === StudentApproval.PENDING
                        ? [
                            {
                              name: 'Approve Students',
                              handleAction: approveStud,
                              privilege: Privileges.CAN_APPROVE_STUDENT,
                            },
                            {
                              name: 'Reject',
                              handleAction: rejectStud,
                              privilege: Privileges.CAN_APPROVE_STUDENT,
                            },
                          ]
                        : stud === StudentApproval.APPROVED
                        ? [
                            {
                              name: 'Reject',
                              handleAction: rejectStud,
                              privilege: Privileges.CAN_APPROVE_STUDENT,
                            },
                          ]
                        : [
                            {
                              name: 'Approve Students',
                              handleAction: approveStud,
                              privilege: Privileges.CAN_APPROVE_STUDENT,
                            },
                          ]
                    }
                    // actions={studentActions}
                    hide={['id', 'user_type', 'user_id']}
                    uniqueCol="id"
                    unselectAll={unselectAll}
                  />
                )}
              </div>
            )}
          </Tab>
        ))}
      </Tabs>
    </>
  );
}

export default ApproveStudent;
