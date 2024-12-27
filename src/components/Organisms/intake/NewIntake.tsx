import moment from 'moment';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { intakeStore } from '../../../store/administration/intake.store';
import { ValueType } from '../../../types';
import {
  IntakeInfo,
  IntakeInfoErrors,
  IntakeStatus,
  IntakeStatusErrors,
  PeriodType,
} from '../../../types/services/intake.types';
import { formatDateToYyMmDd } from '../../../utils/date-helper';
import { getDropDownStatusOptions } from '../../../utils/getOption';
import { randomString } from '../../../utils/random';
import { intakeInfoSchema } from '../../../validations/intake.validation';
import Button from '../../Atoms/custom/Button';
import DateMolecule from '../../Molecules/input/DateMolecule';
import DropdownMolecule from '../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../Molecules/input/TextAreaMolecule';
import Stepper from '../../Molecules/Stepper/Stepper';

interface IProps {
  values: IntakeInfo;
  display_label: string;
  handleChange: (_e: ValueType) => any;
  handleNext: <T>(_e: FormEvent<T>) => any;
  handleProgramsChange?: (_e: ValueType) => any;
}
interface ParamType {
  id: string;
}
interface CProps {
  handleSuccess: () => any;
}

export default function NewIntake(props: CProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams<ParamType>();

  const [values, setValues] = useState<IntakeInfo>({
    id: '',
    title: '',
    actual_end_date: '',
    actual_start_date: '',
    code: '',
    description: '',
    expected_end_date: '',
    expected_start_date: '',
    intake_status: IntakeStatus.OPENED,
    period_type: PeriodType.SEMESTER,
    registration_control_id: id,
    total_num_students: 1,
  });

  function handleChange(e: ValueType) {
    setValues((regControl) => ({ ...regControl, [e.name]: e.value }));
  }

  const { mutateAsync } = intakeStore.create();

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (currentStep === 0) setCurrentStep(currentStep + 1);
    else {
      let code = `INTK-${randomString(4)}-${moment(
        values.expected_start_date === '' ? undefined : values.expected_start_date,
      ).year()}`;

      let data = {
        ...values,
        code,
      };

      await mutateAsync(data, {
        async onSuccess(data) {
          toast.success(data.data.message);
          // await addProgramsToIntake(data.data.data.id.toString());
          props.handleSuccess();
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'error occurred please try again');
        },
      });
    }
  }

  return (
    <div className="w-full">
      <Stepper
        currentStep={currentStep}
        completeStep={currentStep}
        width="w-64"
        isVertical={false}
        isInline={false}
        navigateToStepHandler={() => {}}>
        <IntakeInfoComponent
          display_label="info"
          values={values}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
        <IntakeStatusComponent
          display_label="more"
          values={values}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
      </Stepper>
    </div>
  );
}

function IntakeInfoComponent({ values, handleChange, handleNext }: IProps) {
  const initialErrorState: IntakeInfoErrors = {
    title: '',
    total_num_students: '',
  };

  const [errors, setErrors] = useState<IntakeInfoErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = intakeInfoSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })
      .catch((err) => {
        const validatedErr: IntakeInfoErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof IntakeInfoErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        error={errors.title}
        required={false}
        name="title"
        placeholder="Intake title"
        value={values.title}
        handleChange={handleChange}>
        Intake title
      </InputMolecule>
      <TextAreaMolecule
        name={'description'}
        value={values.description}
        handleChange={handleChange}>
        Description
      </TextAreaMolecule>
      <InputMolecule
        required={false}
        error={errors.total_num_students}
        name="total_num_students"
        placeholder="Number"
        value={values.total_num_students.toString()}
        type="number"
        handleChange={handleChange}>
        Total number of students
      </InputMolecule>
      {/* <DropdownMolecule
        name="programs"
        placeholder="Program"
        handleChange={handlePrograms}
        isMulti
        options={getDropDownOptions(programs)}>
        Programs in this intake
      </DropdownMolecule> */}
      <div className="pt-3">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

function IntakeStatusComponent({ values, handleChange, handleNext }: IProps) {
  const initialErrorState: IntakeStatusErrors = {
    expected_start_date: '',
    expected_end_date: '',
    period_type: '',
    intake_status: '',
  };

  const [errors, setErrors] = useState<IntakeStatusErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = intakeInfoSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: IntakeStatusErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof IntakeStatusErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DateMolecule
        error={errors.expected_start_date}
        showTime={false}
        handleChange={handleChange}
        name={'expected_start_date'}>
        Expected Start Date
      </DateMolecule>
      <div className="pt-4">
        <DateMolecule
          error={errors.expected_end_date}
          showTime={false}
          endYear={moment().year() + 15}
          defaultValue={formatDateToYyMmDd(
            moment((moment().year() + 4).toString()).toISOString(),
          )}
          handleChange={handleChange}
          name={'expected_end_date'}>
          Expected End Date
        </DateMolecule>
      </div>
      <DropdownMolecule
        error={errors.period_type}
        defaultValue={getDropDownStatusOptions(PeriodType).find(
          (prd) => prd.value === values.period_type,
        )}
        name="period_type"
        handleChange={handleChange}
        options={getDropDownStatusOptions(PeriodType)}
        placeholder="Select Period type">
        Period type
      </DropdownMolecule>
      <DropdownMolecule
        name="intake_status"
        error={errors.intake_status}
        defaultValue={getDropDownStatusOptions(IntakeStatus).find(
          (intk) => intk.value === values.intake_status,
        )}
        handleChange={handleChange}
        options={getDropDownStatusOptions(IntakeStatus)}>
        Intake status
      </DropdownMolecule>

      <div className="pt-3 flex justify-between">
        <Button styleType="text" color="gray">
          Back
        </Button>
        <Button type="submit">Create intake</Button>
      </div>
    </form>
  );
}
