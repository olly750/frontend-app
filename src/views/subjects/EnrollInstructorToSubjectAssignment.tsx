import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Button from '../../components/Atoms/custom/Button';
import RightSidebar from '../../components/Organisms/RightSidebar';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import {
  EnrollInstructorToSubject,
  ModuleInstructors,
} from '../../types/services/enrollment.types';
import { UserView } from '../../types/services/user.types';

interface AssignSubjectType {
  module_id: string;
  subject_id: string;
  intakeProg: string;
  subInstructors: ModuleInstructors[];
}

export default function EnrollInstructorToSubjectComponent({
  module_id,
  subject_id,
  intakeProg,
  subInstructors,
}: AssignSubjectType) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: instructorInfos, isLoading: instructorLoading } =
    enrollmentStore.getInstructorsByModule(module_id);
  const { data: instructorsInProgram } = enrollmentStore.getInstructorsInProgram(
    intakeProg + '',
  );

  const { t } = useTranslation();

  const [instructors, setInstructors] = useState<UserView[]>([]);

  useEffect(() => {
    let ids: string[] = [];
    for (let i = 0; i < subInstructors?.length; i++) {
      ids.push(subInstructors[i].id + '');
    }
    let instructorsView: UserView[] = [];

    const rankedInstructors =
      instructorInfos?.data.data.filter((inst) => inst.user.person?.current_rank) || [];
    const unrankedInstructors =
      instructorInfos?.data.data.filter(
        (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedInstructors.sort(function (a, b) {
      if (a.user.person && b.user.person) {
        return (
          a.user.person.current_rank?.priority - b.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    const finalInstructors = rankedInstructors.concat(unrankedInstructors);

    finalInstructors.forEach((inst) => {
      if (!ids.includes(inst.id + '')) {
        let instructorView: UserView = {
          id: inst.id,
          rank: inst.user.person?.current_rank?.abbreviation,
          first_name: inst.user.first_name,
          last_name: inst.user.last_name,
          image_url: inst.user.image_url,
          alias_last_name: undefined,
          alias_first_name: undefined,
        };
        instructorsView.push(instructorView);
      }
    });
    setInstructors(instructorsView);
  }, [instructorInfos, instructorsInProgram, subInstructors]);

  const { mutate } = enrollmentStore.enrollInstructorToSubject();

  async function add(data?: string[]) {
    data?.map(async (inst_id) => {
      let found = instructorsInProgram?.data.data.find((instructor) => {
        if (instructor.instructor.id == inst_id) return true;
      });
      let newInstructor: EnrollInstructorToSubject = {
        subject_id: subject_id,
        intake_program_instructor_id: found?.id + '',
      };

      mutate(newInstructor, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['instructors/subject']);
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
      <Button styleType="outline" onClick={() => setSidebarOpen(true)}>
        Enroll {t('Instructor')}
      </Button>
      <RightSidebar
        open={sidebarOpen}
        handleClose={() => setSidebarOpen(false)}
        label={'Enroll ' + t('Instructor') + ' to this subject'}
        data={instructors || []}
        selectorActions={[
          {
            name: 'enroll ' + t('Instructor'),
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={t('Instructor') + ' in this module'}
        isLoading={instructorLoading}
        unselectAll={!sidebarOpen}
      />
    </div>
  );
}
