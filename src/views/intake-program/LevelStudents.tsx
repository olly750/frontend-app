import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import RightSidebar from '../../components/Organisms/RightSidebar';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { Privileges } from '../../types';
import { IntakeLevelParam } from '../../types/services/intake-program.types';
import { SelectorActionType } from '../../types/services/table.types';
import { UserView } from '../../types/services/user.types';
interface ILevelStudent {
  showSidebar: boolean;
  handleShowSidebar: () => void;
}

function LevelStudents({ showSidebar, handleShowSidebar }: ILevelStudent) {
  const { level: levelId } = useParams<IntakeLevelParam>();

  const { data: studentsProgram, isLoading } =
    intakeProgramStore.getStudentsByIntakeProgramLevel(levelId);

  const { mutate } = intakeProgramStore.removeStudentInLevel();
  const picked_role = usePickedRole();
  const [students, setStudents] = useState<UserView[]>([]);
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  useEffect(() => {
    let studentsView: UserView[] = [];

    const rankedStudents =
      studentsProgram?.data.data.filter(
        (inst) => inst.intake_program_student.student.user.person?.current_rank,
      ) || [];
    const unrankedStudents =
      studentsProgram?.data.data.filter(
        (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedStudents.sort(function (a, b) {
      if (
        a.intake_program_student.student.user.person &&
        b.intake_program_student.student.user.person
      ) {
        return (
          a.intake_program_student.student.user.person.current_rank?.priority -
          b.intake_program_student.student.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    const finalStudents = rankedStudents.concat(unrankedStudents);

    finalStudents.forEach((stud) => {
      let studentView: UserView = {
        id: stud.id,
        rank: stud.intake_program_student.student.user.person?.current_rank?.abbreviation,
        first_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? stud.intake_program_student.student.user.person?.alias_first_name
          : stud.intake_program_student.student.user.first_name,
        last_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? stud.intake_program_student.student.user.person?.alias_last_name
          : stud.intake_program_student.student.user.last_name,
        image_url: stud.intake_program_student.student.user.image_url,
        alias_first_name:
          stud.intake_program_student.student.user.person?.alias_first_name,
        alias_last_name: stud.intake_program_student.student.user.person?.alias_last_name,
      };
      studentsView.push(studentView);
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
  }, [studentsProgram]);

  function remove(data?: string[]) {
    data?.map((student) =>
      mutate(student, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['students/intakeProgramlevelId']);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      }),
    );
  }

  let actions: SelectorActionType[] = [
    {
      name: 'remove students',
      handleAction: (data?: string[]) => remove(data),
      privilege: Privileges.CAN_DELETE_STUDENTS_ON_LEVEL_PROGRAM,
    },
  ];

  return (
    <div className="flex flex-col cursor-pointer">
      <Button styleType="outline" onClick={handleShowSidebar}>
        View students
      </Button>
      <RightSidebar
        open={showSidebar}
        handleClose={handleShowSidebar}
        label="All Level Students"
        data={students}
        dataLabel={'Students enrolled'}
        isLoading={isLoading}
        unselectAll={!showSidebar}
        selectorActions={actions}
      />
    </div>
  );
}

export default LevelStudents;
