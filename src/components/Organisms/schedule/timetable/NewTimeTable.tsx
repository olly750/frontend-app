import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import intakeProgramStore from '../../../../store/administration/intake-program.store';
import { moduleStore } from '../../../../store/administration/modules.store';
import { subjectStore } from '../../../../store/administration/subject.store';
import { getInstructorsDeployedInAcademy } from '../../../../store/instructordeployment.store';
import { getAllEvents } from '../../../../store/timetable/event.store';
import {
  getTimetableActivityById,
  timetableStore,
} from '../../../../store/timetable/timetable.store';
import { getAllVenues } from '../../../../store/timetable/venue.store';
import { ParamType, SelectData, ValueType } from '../../../../types';
import { LevelIntakeProgram } from '../../../../types/services/intake-program.types';
import {
  DaysInWeekArray,
  daysOfWeek,
  ICreateTimeTableActivity,
  methodOfInstruction,
} from '../../../../types/services/schedule.types';
import { calculateNumPeriods } from '../../../../utils/calendar';
import { daysBetweenTwoDates, formatDateToYyMmDd } from '../../../../utils/date-helper';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import { randomString } from '../../../../utils/random';
import {
  firstTimetableSchema,
  secondTimetableSchema,
} from '../../../../validations/calendar.validation';
import Button from '../../../Atoms/custom/Button';
import Checkbox from '../../../Atoms/Input/CheckBox';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import Stepper from '../../../Molecules/Stepper/Stepper';

interface IStepProps {
  handleChange: (_e: ValueType) => any;
  setCurrentStep: Function;
  values: ICreateTimeTableActivity;
  handleSubmit?: (_e: FormEvent) => any;
  level?: LevelIntakeProgram;
  isLoading: boolean;
}

interface FirstTimeTableErrors
  extends Pick<ICreateTimeTableActivity, 'venueId' | 'inChargeId'> {}
interface SecondTimeTableErrors
  extends Pick<ICreateTimeTableActivity, 'startHour' | 'endHour' | 'dressCode'> {}

interface IProps {
  activityId?: string;
  isUpdating?: boolean;
}

export default function NewTimeTable({ activityId, isUpdating = false }: IProps) {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { search } = useLocation();

  // query parameters
  const weekId = new URLSearchParams(search).get('week');

  //levelInfo
  const levelInfo = intakeProgramStore.getIntakeLevelById(id).data?.data.data;
  const weekInfo = timetableStore.geTimetableWeekById(weekId || '').data?.data.data;
  const { data: activity } = getTimetableActivityById(activityId);

  //state varibales
  const [currentStep, setcurrentStep] = useState(0);
  const [values, setvalues] = useState<ICreateTimeTableActivity>({
    inChargeId: '',
    startHour: '',
    endHour: '',
    // repeatingDays: [daysOfWeek.MONDAY],
    courseModuleId: '',
    courseModuleSubject: '',
    venueId: '',
    activityDate: new Date().toString(),
    courseCode: randomString(6),
    dayOfWeek: daysOfWeek.MONDAY,
    dressCode: '',
    eventId: '',
    methodOfInstruction: methodOfInstruction.LEC,
    periods: 1,
    weeklyTimetableId: weekId || '',
  });

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  useEffect(() => {
    if (activity?.data.data) { 
      setvalues((prev) => ({
        ...prev,
        inChargeId: activity.data.data.in_charge.adminId,
        startHour: activity.data.data.start_hour,
        endHour: activity.data.data.end_hour,
        courseModuleId: activity.data.data.course_module?.id.toString() || '',
        courseModuleSubject: activity.data.data.course_module_subject,
        venueId: activity.data.data.venue.id.toString(),
        activityDate: formatDateToYyMmDd(activity.data.data.activity_date),
        courseCode: activity.data.data.course_code,
        dayOfWeek: activity.data.data.day_of_week,
        dressCode: activity.data.data.dress_code,
        eventId: activity.data.data.event?.id.toString() || '',
        methodOfInstruction: activity.data.data.method_of_instruction,
        periods: activity.data.data.periods,
      }));
    }
  }, [activity?.data]);

  const { mutateAsync, isLoading } = timetableStore.createTimetableActivity();
  const { mutateAsync: updateMutation, isLoading: updating } =
    timetableStore.updateTimetableActivityById();

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();

    // let timetable = values.repeatingDays.map((d) => ({
    //   dayOfWeek: d,
    //   endHour: values.endHour,
    //   startHour: values.startHour,
    // })) as createRecurringSchedule[];

    let data: ICreateTimeTableActivity = {
      ...values,
      periods: calculateNumPeriods(values.startHour, values.endHour),
      activityDate: formatDateToYyMmDd(values.activityDate),
      dayOfWeek: DaysInWeekArray[new Date(values.activityDate).getDay()],
    };

    if (data.periods < 0) {
      toast.error('Start hour must be less than end hour');
      return;
    }

    if (
      weekInfo &&
      (daysBetweenTwoDates(weekInfo?.start_date, data.activityDate) < 1 ||
        daysBetweenTwoDates(weekInfo?.end_date, data.activityDate) > 1)
    ) {
      toast.error(
        `Activity date must be within week date range (From ${weekInfo?.start_date} to ${weekInfo?.end_date})`,
        {
          duration: 5000,
        },
      );
      return;
    }

    if (activityId && isUpdating) {
      updateMutation(
        { ...data, id: activityId },
        {
          async onSuccess(_data) {
            toast.success('Activity was updated successfully');
            queryClient.invalidateQueries(['timetable/weeks', id]);
            queryClient.invalidateQueries(['timetable/week/current/:id', id]);
            history.goBack();
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        },
      );
    } else {
      mutateAsync(data, {
        async onSuccess(_data) {
          toast.success('Timetable was created successfully');
          queryClient.invalidateQueries(['timetable/weeks', id]);
          queryClient.invalidateQueries(['timetable/week/current/:id', id]);
          history.goBack();
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'error occurred please try again');
        },
      });
    }
  }

  return (
    <Stepper
      currentStep={currentStep}
      completeStep={currentStep}
      width="w-64"
      isVertical={false}
      isInline={false}
      navigateToStepHandler={() => {}}>
      <FirstStep
        values={values}
        handleChange={handleChange}
        setCurrentStep={setcurrentStep}
        level={levelInfo}
        isLoading={isLoading || updating}
      />
      <SecondStep
        values={values}
        handleChange={handleChange}
        setCurrentStep={setcurrentStep}
        handleSubmit={handleSubmit}
        level={levelInfo}
        isLoading={isLoading || updating}
      />
    </Stepper>
  );
}

function FirstStep({ values, handleChange, setCurrentStep, level }: IStepProps) {
  const [useModule, setuseModule] = useState(values.eventId.length === 0);
  const picked_role = usePickedRole();

  const { t } = useTranslation();
  const instructors =
    getInstructorsDeployedInAcademy(picked_role?.academy_id + '').data?.data.data || [];

  const rankedInstructors =
    instructors?.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructors?.filter(
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

  const modules =
    moduleStore.getModulesByProgram(level?.intake_program.program.id + '').data?.data
      .data || [];

  const events = getAllEvents(picked_role?.academy_id).data?.data.data || [];
  const venues = getAllVenues(picked_role?.academy_id).data?.data.data || [];

  const initialErrorState: FirstTimeTableErrors = {
    inChargeId: '',
    venueId: '',
  };

  const [errors, setErrors] = useState<FirstTimeTableErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = firstTimetableSchema.validate(values, {
      abortEarly: false,
    });
    validatedForm
      .then(() => setCurrentStep(1))
      .catch((err) => {
        console.log(err.inner);
        const validatedErr: FirstTimeTableErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof FirstTimeTableErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  const [moduleid, setSelectedModule] = useState('');

  const subjectData =
    subjectStore.getSubjectsByModule(moduleid + '').data?.data.data || [];

  // const subjectData = subjectStore.getSubjectsByModule(moduleid);
  //  console.log("subjectData",subjectData)
  function handleSelectSubject(e: ValueType) {
    handleChange({ name: 'moduleSubjectId', value: e.value });
    alert(e.value);
  }

  // console.log("moduleid",moduleid)
  function handleSelectModule(e: ValueType) {
    setSelectedModule(e.value + '');

    handleChange({ name: 'courseModuleId', value: e.value });
    let course_code = modules.find((m) => m.id === e.value)?.code;
    handleChange({
      name: 'courseCode',
      value: course_code?.toString() || values.courseCode,
    });
    handleChange({ name: 'eventId', value: '' });
  }

  function handleSelectEvent(e: ValueType) {
    handleChange({ name: 'eventId', value: e.value });
    let course_code = events.find((ev) => ev.id === e.value)?.code;
    handleChange({
      name: 'courseCode',
      value: course_code?.toString() || values.courseCode,
    });
    handleChange({ name: 'courseModuleId', value: '' });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="-mb-6">
        {/* <InputMolecule
          name=""
          readOnly
          disabled
          value={`${level?.intake_program.program.name} - ${level?.academic_program_level.level.name}`}>
          Program - Level
        </InputMolecule> */}
        <InputMolecule
          type="date"
          // options={getDropDownStatusOptions(daysOfWeek).slice(0, 7)}
          name="activityDate"
          placeholder="Date"
          handleChange={handleChange}
          value={values.activityDate}>
          Activity date
        </InputMolecule>
        {useModule ? (
          <SelectMolecule
            name="courseModuleId"
            value={values.courseModuleId}
            handleChange={handleSelectModule}
            options={
              modules?.map((mod) => ({
                label: mod.name,
                value: mod.id,
              })) as SelectData[]
            }
            placeholder="Select module">
            Module
          </SelectMolecule>
        ) : (
          <SelectMolecule
            name="eventId"
            value={values.eventId}
            handleChange={handleSelectEvent}
            options={
              events?.map((event) => ({
                label: event.name,
                value: event.id,
              })) as SelectData[]
            }
            placeholder="Select module">
            Event
          </SelectMolecule>
        )} 
        <InputMolecule
          // error={errors.courseModuleSubject}
          required={false}
          name="courseModuleSubject"
          placeholder="Course Module Subject or lesson"
          value={values.courseModuleSubject}
          handleChange={handleChange}>
          Specify Module Subject and lesson
        </InputMolecule>
        <div className="text-right">
          <Checkbox
            name="module"
            value="va"
            checked={!useModule}
            label="Choose event instead"
            handleChange={() => setuseModule(!useModule)}
          />
        </div>
        <SelectMolecule
          error={errors.venueId}
          name="venueId"
          value={values.venueId}
          handleChange={handleChange}
          options={
            venues?.map((vn) => ({ label: vn.name, value: vn.id })) as SelectData[]
          }
          placeholder="Select venue">
          Venue
        </SelectMolecule>
        <SelectMolecule
          error={errors.inChargeId}
          name="inChargeId"
          value={values.inChargeId}
          handleChange={handleChange}
          options={
            finalInstructors?.map((user) => ({
              label: `${user.user.person?.current_rank?.abbreviation || ''} ${
                user.user.first_name
              } ${user.user.last_name}`,
              value: user.user.id,
            })) as SelectData[]
          }
          placeholder="Select someone">
          {t('instructor')}
        </SelectMolecule>
        <div className="pt-4">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </div>
  );
}

function SecondStep({
  values,
  handleChange,
  handleSubmit,
  setCurrentStep,
  isLoading,
}: IStepProps) {
  const initialErrorState: SecondTimeTableErrors = {
    startHour: '',
    endHour: '',
    dressCode: '',
  };

  const [errors, setErrors] = useState<SecondTimeTableErrors>(initialErrorState);

  const handleFinish = (e: FormEvent) => {
    e.preventDefault();

    const validatedForm = secondTimetableSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        if (handleSubmit) handleSubmit(e);
      })
      .catch((err) => {
        console.log(err.inner);
        const validatedErr: SecondTimeTableErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof SecondTimeTableErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  /**
    activityDate: '',
    courseCode: '',
    methodOfInstruction: methodOfInstruction.LEC,
    weeklyTimetableId: '',
   */

  return (
    <form onSubmit={handleFinish} className="max-w-sm -mb-6">
      <InputMolecule
        error={errors.startHour}
        required={false}
        name="startHour"
        type="time"
        value={values.startHour}
        handleChange={handleChange}>
        Start hour
      </InputMolecule>
      <InputMolecule
        error={errors.endHour}
        type="time"
        value={values.endHour}
        name="endHour"
        handleChange={handleChange}>
        End hour
      </InputMolecule>
      {/* <InputMolecule
        name="periods"
        placeholder="Periods"
        type="number"
        value={values.periods}
        handleChange={handleChange}>
        Number of periods
      </InputMolecule> */}
      <InputMolecule
        error={errors.dressCode}
        required={false}
        name="dressCode"
        placeholder="Dressing code"
        value={values.dressCode}
        handleChange={handleChange}>
        Dress code
      </InputMolecule>
      <SelectMolecule
        name="methodOfInstruction"
        value={values.methodOfInstruction}
        handleChange={handleChange}
        options={getDropDownStatusOptions(methodOfInstruction)}>
        Method of instruction
      </SelectMolecule>
      <div className="pt-4 flex justify-between w-80">
        <Button styleType="text" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
}
