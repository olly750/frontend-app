import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Students from '../../components/Organisms/user/Students';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import { classStore, getStudentsByClass } from '../../store/administration/class.store';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { Privileges } from '../../types';
import { IStudentClass } from '../../types/services/class.types';
import { IntakePeriodParam } from '../../types/services/intake-program.types';
import { SelectorActionType } from '../../types/services/table.types';
import { UserInfo, UserTypes } from '../../types/services/user.types';
import AddStudents from './AddStudents';

export default function StudentsInClass({ classObject }: IStudentClass) {
  const [students, setStudents] = useState<UserTypes[]>([]);

  const [leaders, setLeaders] = useState<{
    instructor_in_charge_one?: UserInfo;
    instructor_in_charge_two?: UserInfo;
    instructor_in_charge_three?: UserInfo;
    class_representative_one?: UserInfo;
  }>({
    instructor_in_charge_one: undefined,
    instructor_in_charge_two: undefined,
    instructor_in_charge_three: undefined,
    class_representative_one: undefined,
  });
  const picked_role = usePickedRole();
  const { mutate } = classStore.removeStudentInClass();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  const {
    intakeId,
    intakeProg,
    id,
    level: levelId,
    period,
  } = useParams<IntakePeriodParam>();
  const { url } = useRouteMatch();
  const { t } = useTranslation();
  const { path } = useRouteMatch();

  const { data: studentsData, isLoading } = getStudentsByClass(classObject.id + '') || [];
  const history = useHistory();
  const { data: instructorProgramLevel } =
    enrollmentStore.getInstructorsInProgramLevel(levelId);

  const { data: studentsProgramLevel } =
    intakeProgramStore.getStudentsByIntakeProgramLevel(levelId);

  useEffect(() => {
    setLeaders((leader) => ({
      ...leader,
      instructor_in_charge_one: instructorProgramLevel?.data.data.find(
        (inst) =>
          inst.intake_program_instructor.instructor.id ===
          classObject.instructor_class_incharge_id,
      )?.intake_program_instructor.instructor.user,
      instructor_in_charge_two: instructorProgramLevel?.data.data.find(
        (inst) =>
          inst.intake_program_instructor.instructor.id ===
          classObject.instructor_class_incharge_two_id,
      )?.intake_program_instructor.instructor.user,
      instructor_in_charge_three: instructorProgramLevel?.data.data.find(
        (inst) =>
          inst.intake_program_instructor.instructor.id ===
          classObject.instructor_class_incharge_three_id,
      )?.intake_program_instructor.instructor.user,
      class_representative_one: studentsProgramLevel?.data.data.find(
        (stud) =>
          stud.intake_program_student.student.id ===
          classObject.class_representative_one_id,
      )?.intake_program_student.student.user,
    }));
  }, [
    classObject.class_representative_one_id,
    classObject.instructor_class_incharge_id,
    classObject.instructor_class_incharge_three_id,
    classObject.instructor_class_incharge_two_id,
    instructorProgramLevel?.data.data,
    studentsProgramLevel?.data.data,
  ]);

  useEffect(() => {
    let tempStuds: any[] = [];

    const rankedStudents =
      studentsData?.data.data.filter((inst) => inst.student.user.person?.current_rank) ||
      [];
    const unrankedStudents =
      studentsData?.data.data.filter(
        (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
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

    finalStudents.forEach((stud) => {
      tempStuds.push({
        alias_first_name: stud.student.user.person?.alias_first_name || '',
        alias_last_name: stud.student.user.person?.alias_last_name || '',
        id: stud.student.id.toString(),
        intake_level_student: stud.id,
        rank: stud.student.user.person?.current_rank?.abbreviation,
        username: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? ''
          : stud.student.user.username,
        'full name': hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? stud.student.user.person?.alias_first_name &&
            stud.student.user.person?.alias_last_name != null
            ? stud.student.user.person?.alias_first_name +
              ' ' +
              stud.student.user.person?.alias_last_name
            : ' '
          : stud.student.user.first_name + ' ' + stud.student.user.last_name,
        email: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? ''
          : stud.student.user.email,
        'ID Card': stud.student.user.person?.nid || '',
        academy: stud.student.user.academy && stud.student.user.academy.name,
        status: stud.student.user.generic_status,
        user_type: stud.student.user.user_type,
      });
    });
 
    setStudents(tempStuds);
  }, [studentsData?.data.data]);

  let actions: SelectorActionType[] = [
    {
      name: 'remove students',
      handleAction: (data?: string[]) => {  
        if (data) {
          remove(data, '');
        }
      },
      privilege: Privileges.CAN_DELETE_CLASSES_MEMBERS,
    },
  ];

  const studentActions = [
    {
      name: 'View report',
      handleAction: (id: string | number | undefined) => {
        history.push(
          `/dashboard/intakes/peformance/${levelId}/${classObject.id}/report/${id}/${period}`,
        ); // go to view user profile
      },
      privilege: Privileges.CAN_ACCESS_REPORTS,
    },
    {
      name: 'remove student',
      handleAction: (id: string | number | undefined) => {
        remove([], id?.toString() || '');
      },
      privilege: Privileges.CAN_DELETE_CLASSES_MEMBERS,
    },
  ];

  function remove(data: string[], studentId: string) {
    if (data.length !== 0) {
      data?.map((studentId) => {
        const conver_student_id_to_class_id: any[] | undefined = studentsData?.data.data.filter(item => item.student.id === studentId);
        if (conver_student_id_to_class_id) {
        const idList: any = conver_student_id_to_class_id.map(item => item.id); 
        const idString = idList.join(', ');
  
        mutate(idString, {
          onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['class/students']);
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
      }
      });
 
    } else {
  
      const conver_student_id_to_class_id = studentsData?.data.data.filter(item => item.student.id === studentId);
      if (conver_student_id_to_class_id && conver_student_id_to_class_id.length > 0) {
      const id = conver_student_id_to_class_id.map(item => item.id).join(', '); 
      mutate(id, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['class/students']);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    }
  }
  }


  return (
    <>
      <div className="flex gap-4 self-end">
        <Permission privilege={Privileges.CAN_CREATE_CLASSES}>
          <Button
            styleType="outline"
            onClick={() => history.push(`${url}/${classObject.id}/edit-class`)}>
            Edit {t('Class')}
          </Button>
        </Permission>
        <Permission privilege={Privileges.CAN_CREATE_CLASSES}>
          <Button
            styleType="outline"
            onClick={() =>
              path.includes('learn')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${levelId}/view-period/${period}/add-class`,
                  )
                : path.includes('teach')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${levelId}/view-period/${period}/add-class`,
                  )
                : path.includes('manage')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${levelId}/view-period/${period}/add-class`,
                  )
                : {}
            }>
            Add a new {t('Class')}
          </Button>
        </Permission>
        <Permission privilege={Privileges.CAN_ACCESS_REPORTS}>
          <Button
            styleType="outline"
            onClick={() =>
              history.push(`/dashboard/intakes/peformance/${levelId}/${classObject.id}`)
            }>
            View performance
          </Button>
        </Permission>

        <Button
          styleType="outline"
          onClick={() => history.push(`${url}/${classObject.id}/subject`)}>
          View subjects
        </Button>
        <Permission privilege={Privileges.CAN_CREATE_CLASSES_MEMBERS}>
          <AddStudents classId={parseInt(classObject.id + '')} />
        </Permission>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10">
        <div className="flex gap-4 pb-2 items-center">
          <Heading fontWeight="semibold" fontSize="sm" color="primary">
            {t('Instructor_representative')} :
          </Heading>
          <Heading fontSize="sm">
            {`${
              leaders.instructor_in_charge_one?.person?.current_rank?.abbreviation ||
              '---'
            } ${leaders.instructor_in_charge_one?.first_name || '---'} ${
              leaders.instructor_in_charge_one?.last_name || '---'
            }`}
          </Heading>
        </div>
        {leaders.instructor_in_charge_two ? (
          <div className="flex gap-4 pb-2 items-center">
            <Heading fontWeight="semibold" fontSize="sm" color="primary">
              {t('Instructor_representative')} backup 1 :
            </Heading>
            <Heading fontSize="sm">
              {`${
                leaders.instructor_in_charge_one?.person?.current_rank?.abbreviation ||
                '---'
              } ${leaders.instructor_in_charge_two.first_name || '---'} ${
                leaders.instructor_in_charge_two.last_name || '---'
              }`}
            </Heading>
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex gap-4 pb-2 items-center">
          <Heading fontWeight="semibold" fontSize="sm" color="primary">
            {t('Class_representative')} :
          </Heading>
          <Heading fontSize="sm">
            {`${
              leaders.instructor_in_charge_one?.person?.current_rank?.abbreviation ||
              '---'
            }  ${leaders.class_representative_one?.first_name || '---'} ${
              leaders.class_representative_one?.last_name || '---'
            }`}
          </Heading>
        </div>
        {leaders.instructor_in_charge_three ? (
          <div className="flex gap-4 pb-2 items-center">
            <Heading fontWeight="semibold" fontSize="sm" color="primary">
              {t('Instructor_representative')} backup 2 :
            </Heading>
            <Heading fontSize="sm">
              {`${
                leaders.instructor_in_charge_one?.person?.current_rank?.abbreviation ||
                '---'
              }  ${leaders.instructor_in_charge_three.first_name || '---'} ${
                leaders.instructor_in_charge_three.last_name || '---'
              }`}
            </Heading>
          </div>
        ) : null}
      </div>
      <section>
        {isLoading ? (
          <Loader />
        ) : studentsData?.data.data && studentsData?.data.data?.length <= 0 ? (
          <NoDataAvailable
            showButton={false}
            icon="user"
            buttonLabel="Add new students"
            title={'No students available in this ' + t('Class')}
            handleClick={() => {}}
            description={
              'This ' +
              t('Class') +
              ' has not received any students. you can add one from the button on the top left.'
            }
          />
        ) : (
          <Students
            students={students}
            showTableHeader={false}
            selectorActions={actions}
            studentActions={studentActions}
            enumtype={'UserTypes'}
          />
        )}
      </section>
    </>
  );
}
