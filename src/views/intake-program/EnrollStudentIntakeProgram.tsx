import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import RightSidebar from '../../components/Organisms/RightSidebar';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import { getProgramsByIntake } from '../../store/administration/intake.store';
import { Privileges } from '../../types';
import {
  EnrollmentMode,
  EnrollStudentToProgram,
  StudentApproval,
} from '../../types/services/enrollment.types';
import {
  IntakeProgParam,
  StudentIntakeProgram,
} from '../../types/services/intake-program.types';
import { UserView } from '../../types/services/user.types';

// eslint-disable-next-line no-unused-vars
interface ProgramEnrollmentProps<T> {
  existing: StudentIntakeProgram[];
  showSidebar: boolean;
  handleShowSidebar: () => void;
}

function EnrollStudentIntakeProgram<T>({
  existing,
  showSidebar,
  handleShowSidebar,
}: ProgramEnrollmentProps<T>) {
  const { intakeProg, intakeId } = useParams<IntakeProgParam>();
  const picked_role = usePickedRole();

  const { data: studentsInAcademy, isLoading } =
    enrollmentStore.getStudentAcademyAndEnrollmentStatus(
      picked_role?.academy_id + '',
      StudentApproval.APPROVED,
    );
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const programs = getProgramsByIntake(intakeId).data?.data.data;

  const intakeProgram = programs?.find((pr) => pr.id === intakeProg);

  // let intakeStudents = programs?.map(
  //   (prg) => intakeProgramStore.getStudentsByIntakeProgram(prg.id + '').data?.data.data,
  // );

  // let approvedStudents = intakeStudents?.find((intk) =>
  //   intk?.filter((stud) => stud.enrolment_status === StudentApproval.APPROVED),
  // );

  const [students, setStudents] = useState<UserView[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    let existing_ids: string[] = [];

    for (let index = 0; index < existing.length; index++) {
      existing_ids.push(existing[index].student.id + '');
    }
    let studentsView: UserView[] = [];

    const rankedStudents =
      studentsInAcademy?.data.data.filter(
        (inst) => inst.student.user.person?.current_rank,
      ) || [];
    const unrankedStudents =
      studentsInAcademy?.data.data.filter(
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

    const finalInstructors = rankedStudents.concat(unrankedStudents);

    finalInstructors.forEach((stud) => {
      if (!existing_ids.includes(stud.student.id + '')) {
        let studentView: UserView = {
          alias_first_name:
            stud.student.user.person?.alias_first_name === null
              ? 'Alias'
              : stud.student.user.person?.alias_first_name,
          alias_last_name:
            stud.student.user.person?.alias_last_name === null
              ? 'last_Alias'
              : stud.student.user.person?.alias_last_name,
          id: stud.student.id,
          rank: stud.student.user.person?.current_rank?.abbreviation,
          first_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
            ? stud.student.user.person?.alias_first_name
            : stud.student.user.first_name,
          last_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
            ? stud.student.user.person?.alias_last_name
            : stud.student.user.last_name,
          image_url: stud.student.user.image_url,
        };
        studentsView.push(studentView);
      }
    });
    for (let i = 0; i < studentsView.length; i++) {
      for (let j = i + 1; j < studentsView.length; j++) {
        if (studentsView[i].id === studentsView[j].id) {
          studentsView.splice(j, 1);
          j--;
        }
      }
    }
    setStudents(studentsView);
  }, [existing, studentsInAcademy?.data.data]);

  const { mutate } = enrollmentStore.enrollStudentToProgram();

  function add(data?: string[]) {
    data?.map((stud_id) => {
      let studentInfo = studentsInAcademy?.data.data.find((st) => st.id === stud_id)
        ?.student.user;

      let reg_no = studentsInAcademy?.data.data.find((st) => st.id === stud_id)?.student
        .reg_number;

      let newStudent: EnrollStudentToProgram = {
        completed_on: '',
        employee_number: studentInfo?.person?.service_number || '',
        enroled_on: studentInfo?.created_on || '',
        enrolment_mode: EnrollmentMode.NEW,
        enrolment_status: StudentApproval.APPROVED,
        intake_program_id: intakeProgram?.id.toString() || '',
        other_rank:
          studentInfo?.person?.other_rank ||
          studentInfo?.person?.current_rank.id + '' ||
          '',
        rank_id: studentInfo?.person?.current_rank.id.toString() || '',
        rank_institution: studentInfo?.person?.rank_depart || '',
        student_id: stud_id,
        third_party_reg_number: reg_no || '',
      };

      mutate(newStudent, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['students/intakeProgramId/status']);
          handleShowSidebar();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    });
  }
  console.log(students);

  return (
    <div className="cursor-pointer">
      <Button
        styleType="text"
        onClick={handleShowSidebar}
        className="flex -m-10 items-center justify-end text-primary-500">
        <Icon name="add" size={12} fill="primary" />
        Enroll existing students
      </Button>
      <RightSidebar
        open={showSidebar}
        handleClose={handleShowSidebar}
        label={'Enroll students to ' + t('Program')}
        data={students}
        selectorActions={[
          {
            name: 'enroll students',
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={'Students approved in this academy'}
        isLoading={isLoading}
        unselectAll={!showSidebar}
      />
    </div>
  );
}

export default EnrollStudentIntakeProgram;
