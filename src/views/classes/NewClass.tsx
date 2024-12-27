import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import { classStore } from '../../store/administration/class.store';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { ValueType } from '../../types';
import { ClassGroupType, ICreateClass } from '../../types/services/class.types';
import { Instructor } from '../../types/services/instructor.types';
import { IntakePeriodParam } from '../../types/services/intake-program.types';
import { Student } from '../../types/services/user.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../../utils/getOption';
import { useClassValidation } from '../../validations/level.validation';

interface ClassError
  extends Pick<
    ICreateClass,
    | 'class_name'
    | 'instructor_class_in_charge_id'
    | 'class_representative_one_id'
    | 'instructor_class_in_charge_two_id'
  > {
  class_group_type: string;
}

function NewClass() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { classSchema } = useClassValidation();

  const [form, setForm] = useState<ICreateClass>({
    class_group_type: ClassGroupType.CLASS,
    class_name: '',
    class_representative_one_id: '',
    class_representative_tree_id: '',
    class_representative_two_id: '',
    instructor_class_in_charge_id: '',
    instructor_class_in_charge_two_id: '',
    instructor_class_in_charge_three_id: '',
    intake_academic_year_period_id: 0,
    intake_level_id: 0,
  });

  const initialErrorState: ClassError = {
    class_group_type: '',
    class_name: '',
    instructor_class_in_charge_id: '',
    instructor_class_in_charge_two_id: '',
    class_representative_one_id: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const levelIdTitle = document.getElementById('intake_level_id')?.title;
  const {
    level: levelId,
    intakeProg,
    intakeId,
    id,
    period,
  } = useParams<IntakePeriodParam>();
  useEffect(
    () =>
      setForm((frm) => {
        return {
          ...frm,
          intake_level_id: parseInt(levelIdTitle || ''),
        };
      }),
    [levelIdTitle],
  );

  const { data: levelInstructors, isLoading: instLoading } =
    enrollmentStore.getInstructorsInProgramLevel(levelId);

  const instructors =
    levelInstructors?.data.data.map(
      (inst) => inst.intake_program_instructor.instructor,
    ) || [];

  const rankedInstructors =
    instructors.filter((stud) => stud.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructors.filter(
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

  const students =
    intakeProgramStore.getStudentsByIntakeProgramLevel(levelId).data?.data.data || [];

  const studentsInProgram = students.map((stu) => stu.intake_program_student.student);

  const rankedStudents =
    studentsInProgram.filter((stud) => stud.user.person?.current_rank) || [];
  const unrankedStudents =
    studentsInProgram.filter(
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

  function handleChange(e: ValueType) {
    setForm({ ...form, [e.name]: e.value });
  }

  const { mutate } = classStore.addClass();

  function submitForm(e: FormEvent) {
    e.preventDefault();

    const validatedForm = classSchema.validate(form, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutate(
          { ...form, intake_academic_year_period_id: parseInt(period) },
          {
            onSuccess: (data) => {
              toast.success(data.data.message);
              queryClient.invalidateQueries(['class/periodId']);

              path.includes('learn')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${levelId}/view-period/${period}/view-class`,
                  )
                : path.includes('teach')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${levelId}/view-period/${period}/view-class`,
                  )
                : path.includes('manage')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${levelId}/view-period/${period}/view-class`,
                  )
                : {};
            },
            onError: (error: any) => {
              toast.error(error.response.data.message);
            },
          },
        );
      })
      .catch((err) => {
        const validatedErr: ClassError = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ClassError] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <>
      <form onSubmit={submitForm} className="max-h-96 w-96 overflow-y-auto">
        <InputMolecule
          title={levelId}
          id="intake_level_id"
          type="hidden"
          value={levelId}
          name="intake_level_id"
        />
        <DropdownMolecule
          error={errors.class_group_type}
          name="class_group_type"
          handleChange={handleChange}
          defaultValue={getDropDownStatusOptions(ClassGroupType).find(
            (cl) => cl.value === form.class_group_type,
          )}
          options={getDropDownStatusOptions(ClassGroupType)}
          placeholder={'Choose ' + t('Class') + ' type'}>
          {t('Class')} Type
        </DropdownMolecule>

        <InputMolecule
          error={errors.class_name}
          value={form.class_name}
          handleChange={handleChange}
          name="class_name">
          {t('Class')} name
        </InputMolecule>
        <DropdownMolecule
          error={errors.instructor_class_in_charge_id}
          name="instructor_class_in_charge_id"
          handleChange={handleChange}
          options={getDropDownOptions({
            inputs: finalInstructors,
            labelName: ['first_name', 'last_name'],
            //@ts-ignore
            getOptionLabel: (inst: Instructor) =>
              `${inst.user.person?.current_rank?.abbreviation || ''} ${
                inst.user.first_name
              } ${inst.user.last_name}`,
          })}
          placeholder={
            instLoading
              ? 'Loading ' + t('Instructor_representative') + ' ...'
              : 'Choose ' + t('Instructor_representative')
          }>
          {t('Instructor_representative')}
        </DropdownMolecule>

        <DropdownMolecule
          error={errors.instructor_class_in_charge_two_id}
          name="instructor_class_in_charge_two_id"
          handleChange={handleChange}
          options={getDropDownOptions({
            inputs: finalInstructors.filter(
              (inst) => inst.id !== form.instructor_class_in_charge_id,
            ),
            labelName: ['first_name', 'last_name'],
            //@ts-ignore
            getOptionLabel: (inst: Instructor) =>
              `${inst.user.person?.current_rank?.abbreviation || ''} ${
                inst.user.first_name
              } ${inst.user.last_name}`,
          })}
          placeholder={
            instLoading
              ? t('Instructor_representative') + ' backup 1 ...'
              : 'Choose ' + t('Instructor_representative')
          }>
          {t('Instructor_representative')} backup 1
        </DropdownMolecule>
        <DropdownMolecule
          name="instructor_class_in_charge_three_id"
          handleChange={handleChange}
          options={getDropDownOptions({
            inputs: finalInstructors.filter(
              (inst) =>
                inst.id !== form.instructor_class_in_charge_id &&
                inst.id !== form.instructor_class_in_charge_two_id,
            ),
            labelName: ['first_name', 'last_name'],
            //@ts-ignore
            getOptionLabel: (inst: Instructor) =>
              `${inst.user.person?.current_rank?.abbreviation || ''} ${
                inst.user.first_name
              } ${inst.user.last_name}`,
          })}
          placeholder={
            instLoading
              ? t('Instructor_representative') + ' backup 2...'
              : 'Choose ' + t('Instructor_representative')
          }>
          {t('Instructor_representative')} backup 2
        </DropdownMolecule>

        <DropdownMolecule
          error={errors.class_representative_one_id}
          name="class_representative_one_id"
          handleChange={handleChange}
          options={getDropDownOptions({
            inputs: finalStudents,
            labelName: ['first_name', 'last_name'],
            //@ts-ignore
            getOptionLabel: (stu: Student) =>
              `${stu.user.person?.current_rank?.abbreviation || ''} ${
                stu.user.first_name
              } ${stu.user.last_name}`,
          })}
          placeholder={t('Class_representative')}>
          {t('Class_representative')}
        </DropdownMolecule>

        <div className="py-4">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
}

export default NewClass;
