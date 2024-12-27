import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import DateMolecule from '../../components/Molecules/input/DateMolecule';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import SwitchMolecule from '../../components/Molecules/input/SwitchMolecule';
import useAuthenticator from '../../hooks/useAuthenticator';
import { queryClient } from '../../plugins/react-query';
import academicyearsStore from '../../store/administration/academicyears.store';
import { intakeStore } from '../../store/administration/intake.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { getLevelsByAcademicProgram } from '../../store/administration/program.store';
import { ValueType } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import {
  CreateLevelIntakeProgram,
  IntakeProgParam,
  ProgressStatus,
} from '../../types/services/intake-program.types';
import { getDropDownOptions } from '../../utils/getOption';
import { programLevelSchema } from '../../validations/level.validation';
import { NewIntakePeriod } from './NewIntakePeriod';
import usePickedRole from '../../hooks/usePickedRole';

interface ProgLevelErrors
  extends Pick<
    CreateLevelIntakeProgram,
    'incharge_id' | 'academic_year_id' | 'planed_start_on' | 'planed_end_on'
  > {}

export default function NewIntakeProgramLevel() {
  const history = useHistory();
  const picked_role = usePickedRole();
  const [success, setSuccess] = useState(false);

  const { id: programId, intakeProg } = useParams<IntakeProgParam>();

  const programLevels = getLevelsByAcademicProgram(programId).data?.data.data;
  const getLevels =
    intakeProgramStore.getLevelsByIntakeProgram(intakeProg).data?.data.data || [];

  const unaddedLevels = programLevels?.filter(
    (pg) => !getLevels.map((lv) => lv.academic_program_level.id).includes(pg.id),
  );

  const intakes = intakeStore.getIntakesByProgram(programId).data?.data.data;

  const intakeProgram = intakes?.find((intpr) => intpr.id === intakeProg);

  const academicYears =
    academicyearsStore.fetchAcademicYears(picked_role?.academy_id + '').data?.data.data ||
    [];

  const { data: instructorsProgram, isLoading: instLoading } =
    intakeProgramStore.getInstructorsByIntakeProgram(intakeProg);

  const instructors = instructorsProgram?.data.data.map((inst) => inst.instructor) || [];

  const rankedInstructors =
    instructors.filter((inst) => inst.user.person?.current_rank) || [];
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

  const [values, setvalues] = useState<CreateLevelIntakeProgram>({
    academic_program_level_id: '',
    academic_year_id: '',
    academic_year_program_intake_level_id: 0,
    actual_end_on: '',
    actual_start_on: '',
    incharge_id: '',
    intake_program_id: intakeProgram?.id.toString() || '',
    planed_end_on: '',
    planed_start_on: '',
    progress_status: ProgressStatus.STARTED,
  });

  const [intakeprogramlevelId, setIntakeprogramlevelId] = useState('');

  const [checked, setchecked] = useState(-1);

  const { mutateAsync, isLoading } = intakeProgramStore.addLevelToIntakeProgram();

  function handleChange(e: ValueType) {
    setvalues({ ...values, [e.name]: e.value });
  }
  const handleCheck = (index: number, id: string) => {
    setvalues({ ...values, academic_program_level_id: id });

    if (index === checked) {
      setchecked(-1);
    } else {
      setchecked(index);
    }
  };

  const initialErrorState: ProgLevelErrors = {
    incharge_id: '',
    academic_year_id: '',
    planed_start_on: '',
    planed_end_on: '',
  };

  const [errors, setErrors] = useState<ProgLevelErrors>(initialErrorState);

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault(); // prevent page to reload:

    const validatedForm = programLevelSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(values, {
          onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['levels/academy']);
            setSuccess(true);
            setIntakeprogramlevelId(data.data.data.id.toString());
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
      })
      .catch((err) => {
        const validatedErr: ProgLevelErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ProgLevelErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  // useEffect(() => {
  //   programLevels && handleCheck(0, programLevels[0].id.toString());
  // }, [programLevels]);

  useEffect(() => {
    setvalues((vals) => {
      return { ...vals, intake_program_id: intakeProgram?.id.toString() || '' };
    });
  }, [intakeProgram]);

  let academic_year = academicYears.find((yr) => yr.id == values.academic_year_id);

  const { t } = useTranslation();

  return (
    <div className="p-10 w-3/5">
      <Heading fontWeight="semibold" fontSize="2xl" className="pb-8">
        Add Levels to {t('Program')} Intake
      </Heading>
      <InputMolecule
        readOnly
        name="intake_program_id"
        value={` ${intakeProgram?.program.name} - ${intakeProgram?.intake.code}`}
        handleChange={(_e: ValueType) => {}}>
        Intake {t('Program')}
      </InputMolecule>
      <Heading fontSize="sm" className="py-4">
        Levels
      </Heading>
      {unaddedLevels?.map((programLevel, index) => (
        <div key={index} className={`${checked === index ? 'bg-main' : ''} p-4`}>
          <SwitchMolecule
            value={checked === index}
            name="level"
            handleChange={() => handleCheck(index, programLevel.id.toString())}>
            {programLevel.level.name}
          </SwitchMolecule>
          {checked === index && (
            <div className="py-3 flex flex-col gap-2 ">
              {!success && (
                <form onSubmit={submitForm}>
                  <DropdownMolecule
                    error={errors.incharge_id}
                    hasError={errors.incharge_id !== ''}
                    width="72"
                    placeholder={instLoading ? 'Loading incharge...' : 'Select incharge'}
                    options={getDropDownOptions({
                      inputs: finalInstructors,
                      labelName: ['first_name', 'last_name'],
                      //@ts-ignore
                      getOptionLabel: (instr: Instructor) =>
                        `${instr.user.person?.current_rank?.abbreviation || ''} ${
                          instr.user.first_name
                        } ${instr.user.last_name}`,
                    })}
                    name="incharge_id"
                    handleChange={handleChange}>
                    {t('Instructor')} Incharge
                  </DropdownMolecule>
                  <DropdownMolecule
                    error={errors.academic_year_id}
                    hasError={errors.academic_year_id !== ''}
                    width="72"
                    placeholder="Select academic year"
                    options={getDropDownOptions({ inputs: academicYears })}
                    name="academic_year_id"
                    handleChange={handleChange}>
                    Academic Year
                  </DropdownMolecule>
                  <DateMolecule
                    error={errors.planed_start_on}
                    startYear={moment(
                      academic_year?.planned_start_on === ''
                        ? undefined
                        : academic_year?.planned_start_on,
                    ).year()}
                    endYear={moment(academic_year?.planned_end_on).year()}
                    handleChange={handleChange}
                    reverse={false}
                    name="planed_start_on">
                    Start Date
                  </DateMolecule>
                  <div className="pt-4">
                    <DateMolecule
                      error={errors.planed_end_on}
                      startYear={moment(
                        values.planed_start_on === ''
                          ? undefined
                          : values.planed_start_on,
                      ).year()}
                      endYear={moment(academic_year?.planned_end_on).year()}
                      handleChange={handleChange}
                      name="planed_end_on">
                      End Date
                    </DateMolecule>
                  </div>
                  <div className="mt-4">
                    <Button type="submit" isLoading={isLoading}>
                      Save
                    </Button>
                  </div>
                </form>
              )}
              {success && (
                <NewIntakePeriod checked={checked} level_id={intakeprogramlevelId} />
              )}
            </div>
          )}
        </div>
      ))}
      <Button
        className="mt-4"
        onClick={
          () => history.go(-1)
          // history.push(`/dashboard/intakes/programs/${intakeProg}/${programId}`)
        }>
        Finish
      </Button>
    </div>
  );
}
