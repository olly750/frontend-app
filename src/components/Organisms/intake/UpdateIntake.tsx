import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { queryClient } from '../../../plugins/react-query';
import { intakeStore } from '../../../store/administration/intake.store';
import { ValueType } from '../../../types';
import {
  IntakeInfo,
  IntakeInfoErrors,
  IntakeStatus,
  IntakeStatusErrors,
  PeriodType,
} from '../../../types/services/intake.types';
import { getDropDownStatusOptions } from '../../../utils/getOption';
import { intakeInfoSchema } from '../../../validations/intake.validation';
import Button from '../../Atoms/custom/Button';
import DateMolecule from '../../Molecules/input/DateMolecule';
import DropdownMolecule from '../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../Molecules/input/TextAreaMolecule';
import Stepper from '../../Molecules/Stepper/Stepper';

interface IProps {
  disabled?: boolean;
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

const initialInfoErrorState: IntakeInfoErrors = {
  title: '',
  total_num_students: '',
};

const initialErrorState: IntakeStatusErrors = {
  expected_start_date: '',
  expected_end_date: '',
  period_type: '',
  intake_status: '',
};

export default function UpdateIntake(props: CProps) {
  const [formLoading, setFormLoading] = useState(false);
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

  const { mutateAsync } = intakeStore.update();
  const intake = intakeStore.getIntakeById(id);

  useEffect(() => {
    if (intake.data?.data.data) {
      const _intake = intake?.data.data.data;
      setValues({
        id: _intake.id,
        title: _intake.title,
        actual_end_date: _intake.actual_end_date,
        actual_start_date: _intake.actual_start_date,
        code: _intake.code,
        description: _intake.description,
        expected_end_date: _intake.expected_end_date || '',
        expected_start_date: _intake.expected_start_date || '',
        intake_status: _intake.intake_status,
        period_type: _intake.period_type,
        registration_control_id: _intake.registration_control?.id.toString() || '',
        total_num_students: _intake.total_num_students,
      });
    }
  }, [intake.data?.data.data]);
 

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (currentStep === 0) setCurrentStep(currentStep + 1);
    else {
      const toastId = toast.loading('modifying intake');
      setFormLoading(true);

      await mutateAsync(
        { ...values, total_num_students: +values.total_num_students },
        {
          async onSuccess(data) {
            toast.success(data.data.message, { id: toastId });
            // queryClient.invalidateQueries(['intakes/registrationControl', id]);
            queryClient.invalidateQueries(['intakes/academy', id]);
            setFormLoading(false);
            props.handleSuccess();
          },
          onError(error: any) {
            toast.error(
              error.response.data.message || 'error occurred please try again',
              { id: toastId },
            );
            setFormLoading(false);
          },
        },
      );
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
          disabled={formLoading}
          values={values}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
      </Stepper>
    </div>
  );
}

function IntakeInfoComponent({ values, handleChange, handleNext }: IProps) {
  const [errors, setErrors] = useState<IntakeInfoErrors>(initialInfoErrorState);

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
        const validatedErr: IntakeInfoErrors = initialInfoErrorState;
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
        readOnly={values.title !== ''}
        placeholder="Intake title"
        value={values.title}
        handleChange={handleChange}>
        Intake title
      </InputMolecule>
      <TextAreaMolecule
        required
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
      <div className="pt-3">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

function IntakeStatusComponent({ values, handleChange, handleNext, disabled }: IProps) {
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
      {/* <DateMolecule
        error={errors.expected_start_date}
        showTime={false}
        defaultValue={
          values.expected_start_date ? values.expected_start_date.toString() : ''
        }
        handleChange={handleChange}
        name={'expected_start_date'}>
        Expected Start Date
      </DateMolecule>
      <div className="pt-4">
        <DateMolecule
          error={errors.expected_end_date}
          showTime={false}
          endYear={moment().year() + 15}
          defaultValue={
            values.expected_end_date ? values.expected_end_date.toString() : ''
          }
          handleChange={handleChange}
          name={'expected_end_date'}>
          Expected End Date
        </DateMolecule>
      </div> */}
      <DropdownMolecule
        name="period_type"
        error={errors.period_type}
        handleChange={handleChange}
        defaultValue={getDropDownStatusOptions(PeriodType).find(
          (period) => period.value === values.period_type,
        )}
        options={getDropDownStatusOptions(PeriodType)}
        placeholder="Select Period type">
        Period type
      </DropdownMolecule>
      <DropdownMolecule
        name="intake_status"
        error={errors.intake_status}
        handleChange={handleChange}
        defaultValue={getDropDownStatusOptions(IntakeStatus).find(
          (intake) => intake.value === values.intake_status,
        )}
        options={getDropDownStatusOptions(IntakeStatus)}>
        Intake status
      </DropdownMolecule>

      <div className="pt-3 flex justify-between">
        <Button styleType="text" color="gray">
          Back
        </Button>
        <Button disabled={disabled} type="submit">
          Update intake
        </Button>
      </div>
    </form>
  );
}
