import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import RightSidebar from '../../components/Organisms/RightSidebar';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import { getProgramsByIntake } from '../../store/administration/intake.store';
import instructordeploymentStore, {
  getInstructorByAcademyOrderedByRank,
} from '../../store/instructordeployment.store';
import { EnrollInstructorProgram } from '../../types/services/enrollment.types';
import { InstructorProgram } from '../../types/services/instructor.types';
import { IntakeProgParam } from '../../types/services/intake-program.types';
import { UserView } from '../../types/services/user.types';

interface ProgramEnrollmentProps {
  existing: InstructorProgram[];
  showSidebar: boolean;
  handleShowSidebar: () => void;
}
function EnrollInstructorIntakeProgram({
  existing,
  showSidebar,
  handleShowSidebar,
}: ProgramEnrollmentProps) {
  const { intakeProg, intakeId } = useParams<IntakeProgParam>();
  const picked_role = usePickedRole();

  const { data: instructorsInAcademy, isLoading } = getInstructorByAcademyOrderedByRank(
    picked_role?.academy_id,
  );

  const { t } = useTranslation();

  const programs = getProgramsByIntake(intakeId).data?.data.data;

  const intakeProgram = programs?.find((pr) => pr.id === intakeProg);

  const [instructors, setInstructors] = useState<UserView[]>([]);
  useEffect(() => {
    let existing_ids: string[] = [];
    for (let index = 0; index < existing.length; index++) {
      existing_ids.push(existing[index].instructor.id + '');
    }
    let instructorsView: UserView[] = [];

    instructorsInAcademy?.data.data.content.forEach((inst) => {
      if (!existing_ids.includes(inst.id + '')) {
        let instructorView: UserView = {
          id: inst.id,
          rank: inst.user.person?.current_rank?.abbreviation,
          first_name: inst.user.first_name,
          last_name: inst.user.last_name,
          image_url: inst.user.image_url,
          alias_first_name: undefined,
          alias_last_name: undefined,
        };
        instructorsView.push(instructorView);
      }
    });

    setInstructors(instructorsView);
  }, [instructorsInAcademy, existing, picked_role?.academy_id]);

  const { mutate } = enrollmentStore.enrollInstructorToProgram();

  function add(data?: string[]) {
    data?.map((st_id) => {
      let newInstructor: EnrollInstructorProgram = {
        instructor_id: st_id,
        intake_program_id: intakeProgram?.id + '' || '',
      };

      mutate(newInstructor, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['instructors/intakeprogramId', intakeProg]);
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
      <Button
        styleType="text"
        onClick={handleShowSidebar}
        className="flex -mt-6 items-center justify-end text-primary-500">
        <Icon name="add" size={12} fill="primary" />
        Enroll {t('Instructor')}
      </Button>
      <RightSidebar
        open={showSidebar}
        handleClose={handleShowSidebar}
        label={'Enroll ' + t('Instructor') + ' to ' + t('Program')}
        data={instructors}
        selectorActions={[
          {
            name: 'enroll ' + t('Instructor'),
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={t('Instructor') + ' in this academy'}
        isLoading={isLoading}
        unselectAll={!showSidebar}
      />
    </div>
  );
}

export default EnrollInstructorIntakeProgram;
