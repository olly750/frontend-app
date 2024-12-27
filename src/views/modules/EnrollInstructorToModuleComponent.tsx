import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import RightSidebar from '../../components/Organisms/RightSidebar';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import { ParamType } from '../../types';
import {
  EnrollInstructorToModule,
  ModuleInstructors,
} from '../../types/services/enrollment.types';
import { UserView } from '../../types/services/user.types';

// eslint-disable-next-line no-unused-vars
interface AssignModuleType<T> {
  existing: ModuleInstructors[];
}

function EnrollInstructorToModuleComponent<T>({ existing }: AssignModuleType<T>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { search } = useLocation();
  const { id } = useParams<ParamType>();
  const { t } = useTranslation();
  const intakeProg = new URLSearchParams(search).get('intkPrg');

  const { data: instructorsInProgram, isLoading } =
    enrollmentStore.getInstructorsInProgram(intakeProg + '');

  const [instructors, setInstructors] = useState<UserView[]>([]);

  useEffect(() => {
    let instructorsView: UserView[] = [];
    let ids: string[] = [];
    for (let i = 0; i < existing?.length; i++) {
      ids.push(existing[i].id + '');
    }

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
      if (!ids.includes(inst.instructor.id + '')) {
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

  const { mutate } = enrollmentStore.enrollInstructorToModule();

  function add(data?: string[]) {
    data?.map((inst_id) => {
      let newInstructor: EnrollInstructorToModule = {
        course_module_id: id,
        intake_program_instructor_id: parseInt(inst_id),
      };

      mutate(newInstructor, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['instructors/module']);
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
        label={'Enroll ' + t('Instructor') + ' to this module'}
        data={instructors}
        selectorActions={[
          {
            name: 'enroll ' + t('Instructor'),
            handleAction: (data?: string[]) => add(data),
          },
        ]}
        dataLabel={t('Instructor') + ' in this ' + t('Program')}
        isLoading={isLoading}
        unselectAll={!sidebarOpen}
      />
    </div>
  );
}

export default EnrollInstructorToModuleComponent;
