import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import RightSidebar from '../../components/Organisms/RightSidebar';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import {
  EnrollInstructorLevel,
  EnrollInstructorLevelInfo,
} from '../../types/services/enrollment.types';
import { IntakeLevelParam } from '../../types/services/intake-program.types';
import { UserView } from '../../types/services/user.types';

// eslint-disable-next-line no-unused-vars
interface ProgramEnrollmentProps<T> {
  existing: EnrollInstructorLevelInfo[];
  showSidebar: boolean;
  handleShowSidebar: () => void;
}

function EnrollInstructorToLevel<T>({
  existing,
  showSidebar,
  handleShowSidebar,
}: ProgramEnrollmentProps<T>) {
  const { intakeProg, level: levelId } = useParams<IntakeLevelParam>();

  const { data: instructorsInProgram, isLoading } =
    enrollmentStore.getInstructorsInProgram(intakeProg);

  const level = intakeProgramStore.getIntakeLevelById(levelId).data?.data.data;
  const { t } = useTranslation();

  const [instructors, setInstructors] = useState<UserView[]>([]);
  useEffect(() => {
    let instructor_ids: string[] = [];
    existing.forEach((insLevel) => {
      instructor_ids.push(insLevel.intake_program_instructor.id);
    });
    let instructorsView: UserView[] = [];

    const rankedInstructors =
      instructorsInProgram?.data.data.filter(
        (inst) => inst.instructor.user.person?.current_rank,
      ) || [];
    const unrankedInstructors =
      instructorsInProgram?.data.data.filter(
        (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedInstructors.sort(function (a, b) {
      if (a.instructor.user.person && b.instructor.user.person) {
        return (
          a.instructor.user.person.current_rank?.priority -
          b.instructor.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    const finalInstructors = rankedInstructors.concat(unrankedInstructors);

    finalInstructors.forEach((inst) => {
      if (!instructor_ids.includes(inst.id)) {
        let instructorView: UserView = {
          id: inst.id,
          rank: inst.instructor.user.person?.current_rank?.abbreviation,
          first_name: inst.instructor.user.first_name,
          last_name: inst.instructor.user.last_name,
          image_url: inst.instructor.user.image_url,
          alias_first_name: undefined,
          alias_last_name: undefined,
        };
        instructorsView.push(instructorView);
      }
    });
    setInstructors(instructorsView);
  }, [instructorsInProgram, existing]);

  const { mutate } = enrollmentStore.enrollInstructorToLevel();

  function add(data?: string[]) {
    data?.map((inst_id) => {
      let newInstructor: EnrollInstructorLevel = {
        intake_program_instructor_id: parseInt(inst_id),
        academic_year_program_intake_level_id: parseInt(level?.id + ''),
      };

      mutate(newInstructor, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['instructors/levelsEnrolled', levelId]);
          handleShowSidebar();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    });
  }
  return (
    <div className="cursor-pointer">
      <Button styleType="outline" onClick={handleShowSidebar}>
        Enroll {t('Instructor')}
      </Button>
      <RightSidebar
        open={showSidebar}
        handleClose={handleShowSidebar}
        label={'Enroll ' + t('Instructor') + ' to level'}
        data={instructors}
        selectorActions={[
          {
            name: 'enroll ' + t('Instructor'),
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={t('Instructor') + ' in this level'}
        isLoading={isLoading}
        unselectAll={!showSidebar}
      />
    </div>
  );
}

export default EnrollInstructorToLevel;
