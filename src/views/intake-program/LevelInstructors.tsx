import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../components/Atoms/custom/Button';
import RightSidebar from '../../components/Organisms/RightSidebar';
import { EnrollInstructorLevelInfo } from '../../types/services/enrollment.types';
import { SelectorActionType } from '../../types/services/table.types';
import { UserView } from '../../types/services/user.types';

// eslint-disable-next-line no-unused-vars
interface ProgramEnrollmentProps<T> {
  instructorsData: EnrollInstructorLevelInfo[];
  isLoading: boolean;
  showSidebar: boolean;
  handleShowSidebar: () => void;
}

function LevelInstructors<T>({
  instructorsData,
  isLoading,
  showSidebar,
  handleShowSidebar,
}: ProgramEnrollmentProps<T>) {
  const [instructors, setInstructors] = useState<UserView[]>([]);
  useEffect(() => {
    let instructorView: UserView[] = [];

    const rankedInstructors =
      instructorsData.filter(
        (inst) => inst.intake_program_instructor.instructor.user.person?.current_rank,
      ) || [];
    const unrankedInstructors =
      instructorsData.filter(
        (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedInstructors.sort(function (a, b) {
      if (
        a.intake_program_instructor.instructor.user.person &&
        b.intake_program_instructor.instructor.user.person
      ) {
        return (
          a.intake_program_instructor.instructor.user.person.current_rank?.priority -
          b.intake_program_instructor.instructor.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    const finalInstructors = rankedInstructors.concat(unrankedInstructors);

    finalInstructors.forEach((stud) => {
      let studentView: UserView = {
        id: stud.id,
        rank: stud.intake_program_instructor.instructor.user.person?.current_rank
          ?.abbreviation,
        first_name: stud.intake_program_instructor.instructor.user.first_name,
        last_name: stud.intake_program_instructor.instructor.user.last_name,
        image_url: stud.intake_program_instructor.instructor.user.image_url,
        alias_first_name: undefined,
        alias_last_name: undefined,
      };
      instructorView.push(studentView);
    });
    setInstructors(instructorView);
    // console.log(students.length)
  }, [instructorsData]);

  let actions: SelectorActionType[] = [
    // {
    //   name: 'remove instructors',
    //   handleAction: () => {},
    //   privilege: Privileges.CAN_DELETE_INSTRUCTORS_ON_LEVEL_PROGRAM,
    // },
  ];
  const { t } = useTranslation();

  return (
    <div className="flex flex-col cursor-pointer">
      <Button styleType="outline" onClick={handleShowSidebar}>
        View {t('Instructor')}
      </Button>
      <RightSidebar
        open={showSidebar}
        handleClose={handleShowSidebar}
        label={'All Level ' + t('Instructor')}
        data={instructors}
        dataLabel={t('Instructor') + ' enrolled'}
        isLoading={isLoading}
        unselectAll={!showSidebar}
        selectorActions={actions}
      />
    </div>
  );
}

export default LevelInstructors;
