import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import RightSidebar from '../../components/Organisms/RightSidebar';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import { InstructorAssignModule } from '../../types/services/enrollment.types';
import { UserView } from '../../types/services/user.types';

interface Props {
  module_id: string | number;
  intake_program_id: string | number;
}

function InstructorModuleAssignment({ module_id, intake_program_id }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const { data: instructorsProgram, isLoading: instLoading } =
    enrollmentStore.getInstructorsInProgram(intake_program_id);

  const [instructors, setInstructors] = useState<UserView[]>([]);
  useEffect(() => {
    let users: UserView[] = [];

    const rankedInstructors =
      instructorsProgram?.data.data.filter(
        (inst) => inst.instructor.user.person?.current_rank,
      ) || [];
    const unrankedInstructors =
      instructorsProgram?.data.data.filter(
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

    finalInstructors.map((inst) =>
      users.push({
        id: inst.id,
        rank: inst.instructor.user.person?.current_rank?.abbreviation,
        first_name: inst.instructor.user.first_name,
        last_name: inst.instructor.user.last_name,
        image_url: inst.instructor.user.image_url,
        alias_first_name: undefined,
        alias_last_name: undefined,
      }),
    );
    setInstructors(users);
  }, [instructorsProgram]);

  const { mutate } = enrollmentStore.enrollInstructorToModule();

  function add(data?: string[]) {
    data?.map((inst_id) => {
      let newInstructor: InstructorAssignModule = {
        course_module_id: module_id,
        intake_program_instructor_id: Number(inst_id),
      };

      mutate(newInstructor, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['instructorsinModule/ModuleId']);
          setSidebarOpen(false);
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
        onClick={() => setSidebarOpen(true)}
        className="flex -mt-6 items-center justify-end text-primary-500">
        <Icon name="add" size={12} fill="primary" />
        Assign {t('Instructor')}
      </Button>
      <RightSidebar
        open={sidebarOpen}
        handleClose={() => setSidebarOpen(false)}
        label={'Enroll ' + t('Instructor') + ' to ' + t('Program')}
        data={instructors}
        selectorActions={[
          {
            name: 'assign ' + t('Instructor'),
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={t('Instructor') + ' in this intake ' + t('Program')}
        isLoading={instLoading}
        unselectAll={!sidebarOpen}
      />
    </div>
  );
}

export default InstructorModuleAssignment;
