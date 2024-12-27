import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import { queryClient } from '../../plugins/react-query';
import { intakeStore } from '../../store/administration/intake.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { ValueType } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import { IntakeProgram } from '../../types/services/intake.types';
import { Student } from '../../types/services/user.types';
import { getDropDownOptions, titleCase } from '../../utils/getOption';

export default function AddProgramLeader({
  intakeProg,
  intakeProgram,
}: {
  intakeProg: string;
  intakeProgram?: IntakeProgram;
}) {
  const [leader, setLeader] = useState('');
  const { mutateAsync, isLoading } = intakeStore.modifyIntakeProgram();
  const { search } = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const type = new URLSearchParams(search).get('type');

  const { data: instructors, isLoading: instLoading } =
    intakeProgramStore.getInstructorsByIntakeProgram(intakeProg);

  const { data: students, isLoading: studLoading } =
    intakeProgramStore.getStudentsByIntakeProgram(intakeProg);

  const instructorsToShow = instructors?.data.data.map((inst) => inst.instructor);
  const studentsToShow = students?.data.data.map((inst) => inst.student);

  const rankedInstructors =
    instructorsToShow?.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructorsToShow?.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.user.person && b.user.person) {
      return a.user.person.current_rank?.priority - b.user.person.current_rank?.priority;
    } else {
      return 0;
    }
  });
  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  const rankedStudents =
    studentsToShow?.filter((stud) => stud.user.person?.current_rank) || [];
  const unrankedStudents =
    studentsToShow?.filter(
      (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedStudents.sort(function (a, b) {
    if (a.user.person && b.user.person) {
      return a.user.person.current_rank?.priority - b.user.person.current_rank?.priority;
    } else {
      return 0;
    }
  });
  const finalStudents = rankedStudents.concat(unrankedStudents);

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    if (intakeProgram) {
      mutateAsync(
        {
          intake_id: intakeProgram.intake.id + '',
          program_id: intakeProgram.program.id + '',
          intake_program_id: intakeProgram.id + '',
          description: intakeProgram.description,
          incharge_instructor:
            type === 'instructor' ? leader : intakeProgram.incharge_instructor,
          student_in_lead: type === 'student' ? leader : intakeProgram.student_in_lead,
          status: intakeProgram.generic_status,
        },
        {
          onSuccess() {
            toast.success('Leader successfully updated');
            queryClient.invalidateQueries(['intake-program/id', intakeProg]);
            history.goBack();
          },
          onError(error: any) {
            toast.error(error.response.data.message);
          },
        },
      );
    }
  }

  useEffect(() => {
    if (type === 'instructor') {
      setLeader(intakeProgram?.incharge_instructor || '');
    } else if (type === 'student') {
      setLeader(intakeProgram?.student_in_lead || '');
    }
  }, [intakeProgram?.incharge_instructor, intakeProgram?.student_in_lead, type]);

  return (
    <form onSubmit={submitForm}>
      <div className="mb-6">
        <SelectMolecule
          handleChange={(e: ValueType) => setLeader(e.value + '')}
          name={'leader'}
          placeholder={
            type === 'instructor'
              ? instLoading
                ? 'Loading ' + t('Instructor') + '...'
                : 'Choose ' + t('Instructor')
              : type === 'student'
              ? studLoading
                ? 'Loading students...'
                : 'Choose student'
              : ''
          }
          value={finalInstructors.find((inst) => inst.id === leader)?.id.toString()}
          options={
            type === 'instructor'
              ? getDropDownOptions({
                  inputs: finalInstructors || [],
                  labelName: ['first_name', 'last_name'],
                  //@ts-ignore
                  getOptionLabel: (inst: Instructor) =>
                    inst.user.first_name + ' ' + inst.user.last_name,
                })
              : type === 'student'
              ? getDropDownOptions({
                  inputs: finalStudents || [],
                  labelName: ['first_name', 'last_name'],
                  //@ts-ignore
                  getOptionLabel: (stud: Student) =>
                    `${stud.user.person?.current_rank?.abbreviation || ''} ${
                      stud.user.first_name
                    } ${stud.user.last_name}`,
                })
              : []
          }>
          {titleCase(type || '')}
        </SelectMolecule>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  );
}
