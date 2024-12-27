import moment from 'moment';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import DateMolecule from '../../components/Molecules/input/DateMolecule';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore, {
  getModulesByLevel,
} from '../../store/administration/intake-program.store';
import { subjectStore } from '../../store/administration/subject.store';
import { ValueType } from '../../types';
import { ModuleInstructors } from '../../types/services/enrollment.types';
import {
  AddSubjectPeriod,
  IntakeClassParam,
  IntakeLevelModule,
  IntakeModuleStatus,
} from '../../types/services/intake-program.types';
import { ExtendedSubjectInfo } from '../../types/services/subject.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../../utils/getOption';
import { subjectPrdSchema } from '../../validations/program.validation';

interface SubjectPeriodError
  extends Pick<
    AddSubjectPeriod,
    'subjectId' | 'inchargeId' | 'plannedStartOn' | 'plannedEndOn'
  > {
  intakeProgramModuleLevelId: string;
  satus: string;
}

function AddSubjectToPeriod() {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    level,
    period,
    classId,
    intakeProg,
    id: progId,
  } = useParams<IntakeClassParam>();

  const { data: levelModuleStore, isLoading: LevelLoading } = getModulesByLevel(
    parseInt(level),
  );

  const [subjectPrd, setSubjectPrd] = useState<AddSubjectPeriod>({
    actualEndOn: '',
    actualStartOn: '',
    inchargeId: '',
    intakeAcademicYearPeriodId: 0,
    intakeLevelClassId: 0,
    intakeProgramModuleLevelId: 0,
    marks: 0,
    plannedEndOn: '',
    plannedStartOn: '',
    satus: IntakeModuleStatus.DRAFT,
    subjectId: '',
  });

  const initialErrorState: SubjectPeriodError = {
    intakeProgramModuleLevelId: '',
    subjectId: '',
    inchargeId: '',
    plannedStartOn: '',
    plannedEndOn: '',
    satus: '',
  };

  const [errors, setErrors] = useState<SubjectPeriodError>(initialErrorState);

  const { mutateAsync, isLoading } = intakeProgramStore.addSubjectToPeriod();

  function handleChange(e: ValueType) {
    setSubjectPrd((sub) => ({ ...sub, [e.name]: e.value }));
  }

  const pickedModule: IntakeLevelModule | undefined = levelModuleStore?.data.data.find(
    (lvl) => lvl.id === subjectPrd.intakeProgramModuleLevelId,
  );

  const { data: subjects, isLoading: subjectLoading } = subjectStore.getSubjectsByModule(
    pickedModule?.module.id + '',
  );

  const { data: instructors, isLoading: instLoading } =
    enrollmentStore.getInstructorsByModule(pickedModule?.module.id + '');

  const rankedInstructors =
    instructors?.data.data.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructors?.data.data.filter(
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

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault(); // prevent page to reload:
    const validatedForm = subjectPrdSchema.validate(subjectPrd, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(
          {
            ...subjectPrd,
            intakeLevelClassId: parseInt(classId),
            intakeAcademicYearPeriodId: parseInt(period),
          },
          {
            onSuccess: (data) => {
              toast.success(data.data.message);
              queryClient.invalidateQueries(['subjects/period']);
              history.push(
                `/dashboard/modules/subjects/${subjectPrd.subjectId}/instructors?intkPrg=${intakeProg}&prog=${progId}&lvl=${level}&prd=${period}`,
              );
            },
            onError: (error: any) => {
              toast.error(error.response.data.message);
            },
          },
        );
      })
      .catch((err) => {
        const validatedErr: SubjectPeriodError = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof SubjectPeriodError] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <DropdownMolecule
        error={errors.intakeProgramModuleLevelId}
        hasError={errors.intakeProgramModuleLevelId !== ''}
        handleChange={handleChange}
        name="intakeProgramModuleLevelId"
        placeholder={LevelLoading ? 'Loading modules' : 'select module'}
        options={getDropDownOptions({
          inputs: levelModuleStore?.data.data || [],
          //@ts-ignore
          getOptionLabel: (lev: IntakeLevelModule) => lev.module.name,
        })}>
        Module
      </DropdownMolecule>
      <DropdownMolecule
        error={errors.subjectId}
        hasError={errors.subjectId !== ''}
        handleChange={handleChange}
        name="subjectId"
        placeholder={subjectLoading ? 'Loading subject' : 'select subject'}
        options={getDropDownOptions({
          inputs: subjects?.data.data || [],
          //@ts-ignore
          getOptionLabel: (sub: ExtendedSubjectInfo) => sub.title,
        })}>
        Subject
      </DropdownMolecule>
      {/* <InputMolecule
        value={subjectPrd.marks}
        name="marks"
        handleChange={handleChange}
        type="number">
        Marks
      </InputMolecule> */}
      <DropdownMolecule
        error={errors.inchargeId}
        hasError={errors.inchargeId !== ''}
        handleChange={handleChange}
        name="inchargeId"
        placeholder={instLoading ? 'Loading ' + t('Instructor') : 'select incharge'}
        options={getDropDownOptions({
          inputs: finalInstructors || [],
          //@ts-ignore
          getOptionLabel: (inst: ModuleInstructors) =>
            `${inst.user.person?.current_rank?.abbreviation || ''} ${
              inst.user.first_name
            } ${inst.user.last_name}`,
        })}>
        {t('Instructor')} Incharge
      </DropdownMolecule>
      <DateMolecule
        error={errors.plannedStartOn}
        startYear={moment(
          pickedModule?.planned_start_on === ''
            ? undefined
            : pickedModule?.planned_start_on,
        ).year()}
        endYear={moment(
          pickedModule?.planned_end_on === '' ? undefined : pickedModule?.planned_end_on,
        ).year()}
        handleChange={handleChange}
        reverse={false}
        name="plannedStartOn">
        Start Date
      </DateMolecule>
      <DateMolecule
        error={errors.plannedEndOn}
        startYear={moment(
          subjectPrd.plannedStartOn === '' ? undefined : subjectPrd.plannedStartOn,
        ).year()}
        endYear={moment(
          pickedModule?.planned_end_on === '' ? undefined : pickedModule?.planned_end_on,
        ).year()}
        handleChange={handleChange}
        name="plannedEndOn">
        End Date
      </DateMolecule>
      <DropdownMolecule
        error={errors.satus}
        hasError={errors.satus !== ''}
        handleChange={handleChange}
        name="satus"
        placeholder="subject status"
        defaultValue={getDropDownStatusOptions(IntakeModuleStatus).find(
          (ps) => ps.value === subjectPrd.satus,
        )}
        options={getDropDownStatusOptions(IntakeModuleStatus)}>
        Intake Period Status
      </DropdownMolecule>
      <Button className="mt-4 w-1/4" type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  );
}

export default AddSubjectToPeriod;
