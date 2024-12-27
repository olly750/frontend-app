import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import { classStore } from '../../../../store/administration/class.store';
import {
  getIntakesByAcademy,
  getProgramsByIntake,
} from '../../../../store/administration/intake.store';
import intakeProgramStore from '../../../../store/administration/intake-program.store';
import programStore from '../../../../store/administration/program.store';
import usersStore from '../../../../store/administration/users.store';
import { scheduleStore } from '../../../../store/timetable/calendar.store';
import { getAllEvents } from '../../../../store/timetable/event.store';
import { getAllVenues } from '../../../../store/timetable/venue.store';
import { ParamType, SelectData, ValueType } from '../../../../types';
import {
  CreateEventSchedule,
  createRecurringSchedule,
  daysOfWeek,
  frequencyType,
  methodOfInstruction,
  scheduleAppliesTo,
} from '../../../../types/services/schedule.types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import {
  firstScheduleSchema,
  secondScheduleSchema,
  thirdScheduleSchema,
} from '../../../../validations/calendar.validation';
import Button from '../../../Atoms/custom/Button';
import CheckboxMolecule from '../../../Molecules/input/CheckboxMolecule';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import Stepper from '../../../Molecules/Stepper/Stepper';

interface IStepProps {
  handleChange: (_e: ValueType) => any;
  setCurrentStep: Function;
  values: CreateEventSchedule;
  handleSubmit?: (_e: FormEvent) => any;
  isLoading: boolean;
}

interface FirstScheduleErrors extends Pick<CreateEventSchedule, 'event' | 'venue'> {
  user_in_charge: string;
}

interface SecondScheduleErrors
  extends Pick<CreateEventSchedule, 'plannedStartHour' | 'plannedEndHour'> {
  plannedScheduleStartDate: string;
  plannedScheduleEndDate: string;
}
interface ThirdScheduleErrors {
  appliesTo: string;
  // beneficiaries: string[];
}

export default function NewSchedule() {
  const [values, setvalues] = useState<CreateEventSchedule>({
    appliesTo: undefined,
    beneficiaries: undefined,
    event: '',
    methodOfInstruction: methodOfInstruction.LEC,
    period: 1,
    plannedEndHour: '',
    plannedScheduleStartDate: new Date().toLocaleDateString(),
    plannedScheduleEndDate: new Date().toLocaleDateString(),
    plannedStartHour: new Date().toLocaleTimeString(),
    venue: '',
    frequencyType: frequencyType.ONETIME,
    //not to send to backend
    repeatingDays: [],
    intake: '',
    program: '',
    level: '',
    user_in_charge: '',
  });

  //state varibales
  const [currentStep, setcurrentStep] = useState(0);
  const history = useHistory();
  const { id } = useParams<ParamType>();

  const { mutateAsync, isLoading } = scheduleStore.createEventSchedule();

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    let data: CreateEventSchedule = { ...values };

    if (values.frequencyType == frequencyType.RECURRING) {
      data = {
        ...values,
        recurringSchedule: values.repeatingDays.map((d) => ({
          dayOfWeek: d,
          endHour: values.plannedEndHour,
          startHour: values.plannedStartHour,
        })) as createRecurringSchedule[],
      };
    }

    mutateAsync(data, {
      async onSuccess(_data) {
        toast.success('Schedule was created successfully');
        queryClient.invalidateQueries(['schedules/level-intake/:id', id]);
        queryClient.invalidateQueries(['schedules/program/:id', id]);
        history.goBack();
      },
      onError(error: any) {
        toast.error(error.response.data.message || 'error occurred please try again');
      },
    });
  }
  console.log('rendered');
  return (
    <div>
      <Stepper
        currentStep={currentStep}
        completeStep={currentStep}
        width="w-32"
        isVertical={false}
        isInline={false}
        navigateToStepHandler={() => {}}>
        <FirstStep
          values={values}
          handleChange={handleChange}
          setCurrentStep={setcurrentStep}
          isLoading={isLoading}
        />
        <SecondStep
          values={values}
          handleChange={handleChange}
          setCurrentStep={setcurrentStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
        <ThirdStep
          values={values}
          handleChange={handleChange}
          setCurrentStep={setcurrentStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Stepper>
    </div>
  );
}

function FirstStep({ handleChange, setCurrentStep, values }: IStepProps) {
  const picked_role = usePickedRole();

  const events = getAllEvents(picked_role?.academy_id).data?.data.data;
  const venues = getAllVenues(picked_role?.academy_id).data?.data.data;

  const { data: users } = usersStore.getUsersByAcademy(picked_role?.academy_id || '', {
    page: 0,
    pageSize: 1000,
    sortyBy: 'username',
  });

  const initialErrorState: FirstScheduleErrors = {
    event: '',
    venue: '',
    user_in_charge: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = firstScheduleSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => setCurrentStep(1))
      .catch((err) => {
        const validatedErr: FirstScheduleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof FirstScheduleErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  console.log('rendered 1');

  return (
    <form onSubmit={handleSubmit} className="-mb-6">
      <div className="hidden">
        <InputMolecule value={picked_role?.academy_id} name={'academyId'}>
          Academy id
        </InputMolecule>
      </div>
      <div className="pb-1">
        <SelectMolecule
          name="event"
          value={values.event}
          error={errors.event}
          handleChange={handleChange}
          options={
            events?.map((vn) => ({ label: vn.name, value: vn.id })) as SelectData[]
          }
          placeholder="Select event">
          Event
        </SelectMolecule>
      </div>
      <div className="pb-1">
        <SelectMolecule
          name="venue"
          value={values.venue}
          error={errors.venue}
          handleChange={handleChange}
          options={
            venues?.map((vn) => ({ label: vn.name, value: vn.id })) as SelectData[]
          }
          placeholder="Select venue">
          Venue
        </SelectMolecule>
      </div>
      <div className="pb-1">
        <SelectMolecule
          name="user_in_charge"
          value={values.user_in_charge}
          error={errors.user_in_charge}
          handleChange={handleChange}
          options={
            users?.data.data.content?.map((user) => ({
              label: `${user.person?.current_rank?.abbreviation || ''} ${
                user.person?.first_name || ''
              } ${user.person?.last_name || ''}`,
              value: user.id,
            })) as SelectData[]
          }
          placeholder="Select someone">
          Who is in charge?
        </SelectMolecule>
      </div>
      <div className="pb-4">
        <RadioMolecule
          type="block"
          handleChange={handleChange}
          name={'frequencyType'}
          value={values.frequencyType}
          options={getDropDownStatusOptions(frequencyType)}>
          Event type
        </RadioMolecule>
      </div>
      <Button type="submit">Next</Button>
    </form>
  );
}

function SecondStep({ handleChange, setCurrentStep, values }: IStepProps) {
  const initialErrorState: SecondScheduleErrors = {
    plannedStartHour: '',
    plannedEndHour: '',
    plannedScheduleStartDate: '',
    plannedScheduleEndDate: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cloneValues = { ...values };
    Object.assign(cloneValues, {
      has_date_range: values.frequencyType === frequencyType.DATE_RANGE,
    });
    const validatedForm = secondScheduleSchema.validate(cloneValues, {
      abortEarly: false,
    });

    validatedForm
      .then(() => setCurrentStep(2))
      .catch((err) => {
        const validatedErr: SecondScheduleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof SecondScheduleErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  console.log('rendered 2');

  return (
    <form onSubmit={handleSubmit} className="max-w-sm -mb-6">
      <InputMolecule
        name="plannedStartHour"
        placeholder="Intake title"
        type="time"
        value={values.plannedStartHour}
        error={errors.plannedStartHour}
        required={false}
        handleChange={handleChange}>
        Planned start hour
      </InputMolecule>
      <InputMolecule
        type="time"
        value={values.plannedEndHour}
        error={errors.plannedEndHour}
        name="plannedEndHour"
        placeholder="End time"
        required={false}
        handleChange={handleChange}>
        Planned end hour
      </InputMolecule>
      <InputMolecule
        name="plannedScheduleStartDate"
        error={errors.plannedScheduleStartDate}
        placeholder="Intake title"
        type="date"
        value={values.plannedScheduleStartDate.toLocaleString()}
        required={false}
        handleChange={handleChange}>
        Schedule Start date
      </InputMolecule>
      {values.frequencyType === frequencyType.RECURRING ? (
        <CheckboxMolecule
          isFlex
          options={getDropDownStatusOptions(daysOfWeek).slice(0, 7)}
          name="repeatingDays"
          placeholder="Repeat days:"
          handleChange={handleChange}
          values={values.repeatingDays}
        />
      ) : values.frequencyType === frequencyType.DATE_RANGE ? (
        <InputMolecule
          error={errors.plannedScheduleEndDate}
          required={false}
          name="plannedScheduleEndDate"
          placeholder="Intake title"
          type="date"
          value={values.plannedScheduleEndDate.toLocaleString()}
          handleChange={handleChange}>
          Repetition end date
        </InputMolecule>
      ) : (
        <></>
      )}

      <div className="pt-3 flex justify-between w-80">
        <Button styleType="text" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}

function ThirdStep({
  values,
  handleChange,
  handleSubmit,
  setCurrentStep,
  isLoading,
}: IStepProps) {
  const picked_role = usePickedRole();
  let academyId = picked_role?.academy_id + '';
  const { t } = useTranslation();

  const programs = (
    programStore.getProgramsByAcademy(academyId).data?.data.data || []
  ).map((pr) => ({
    value: pr.id + '',
    label: pr.name,
  })) as SelectData[];

  const intakes = getIntakesByAcademy(academyId, false).data?.data.data.map((intake) => ({
    value: intake.id,
    label: intake.title,
  })) as SelectData[];

  const programIntakes = (
    getProgramsByIntake(values.intake, values.intake.length > 1).data?.data.data || []
  ).map((pi) => ({ value: pi.id, label: pi.program.name })) as SelectData[];

  const levels = (
    intakeProgramStore.getLevelsByIntakeProgram(values.program!).data?.data.data || []
  ).map((lv) => ({
    label: lv.academic_program_level.level.name,
    value: lv.id,
  })) as SelectData[];

  const classes = (classStore.getAllClasses().data?.data.data || [])
    .filter(
      (cl) => cl.academic_year_program_intake_level.intake_program.id == values.program,
    )
    .map((cls) => ({
      label: `${cls.academic_year_program_intake_level.academic_program_level.level.name} - ${cls.class_name}`,
      value: cls.id,
    })) as SelectData[];

  const initialErrorState: ThirdScheduleErrors = {
    appliesTo: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const handleFinish = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validatedForm = thirdScheduleSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => handleSubmit && handleSubmit(e))
      .catch((err) => {
        const validatedErr: ThirdScheduleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ThirdScheduleErrors] = el.message;
        });
        setErrors(validatedErr);
        console.error(err, validatedErr);
      });
  };

  console.log('rendered 3');

  return (
    <form onSubmit={handleFinish} className="max-w-sm -mb-6">
      <DropdownMolecule
        error={errors.appliesTo}
        hasError={errors.appliesTo !== ''}
        name="appliesTo"
        handleChange={handleChange}
        options={getDropDownStatusOptions(scheduleAppliesTo)}
        placeholder="Select group">
        Event concerns
      </DropdownMolecule>

      {(values.appliesTo == scheduleAppliesTo.APPLIES_TO_LEVEL ||
        values.appliesTo == scheduleAppliesTo.APPLIES_TO_CLASS) && (
        <>
          <DropdownMolecule
            name="intake"
            handleChange={handleChange}
            options={intakes}
            placeholder="Select intake">
            Intake
          </DropdownMolecule>
          <DropdownMolecule
            name="program"
            handleChange={handleChange}
            options={programIntakes}
            placeholder={'Select ' + t('Program')}>
            {t('Program')}
          </DropdownMolecule>
        </>
      )}

      <DropdownMolecule
        name="beneficiaries"
        isMulti
        handleChange={handleChange}
        // value={values.beneficiaries}
        options={
          values.appliesTo == scheduleAppliesTo.APPLIES_TO_PROGRAM
            ? programs
            : values.appliesTo == scheduleAppliesTo.APPLIES_TO_LEVEL
            ? levels
            : values.appliesTo == scheduleAppliesTo.APPLIES_TO_CLASS
            ? classes
            : []
        }
        placeholder="Select group">
        {`Select ${values.appliesTo?.split('_')[2]}`}
      </DropdownMolecule>
      <RadioMolecule
        options={getDropDownStatusOptions(methodOfInstruction)}
        handleChange={handleChange}
        name={'methodOfInstruction'}
        value={values.methodOfInstruction}>
        Method of Instruction
      </RadioMolecule>
      <div className="pt-8 flex justify-between w-80">
        <Button styleType="text" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Create schedule
        </Button>
      </div>
    </form>
  );
}
