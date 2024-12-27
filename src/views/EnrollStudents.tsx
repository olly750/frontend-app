import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../components/Atoms/custom/Button';
import DateMolecule from '../components/Molecules/input/DateMolecule';
import DropdownMolecule from '../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../components/Molecules/input/InputMolecule';
import SelectMolecule from '../components/Molecules/input/SelectMolecule';
import Stepper from '../components/Molecules/Stepper/Stepper';
import usePickedRole from '../hooks/usePickedRole';
import academyStore from '../store/administration/academy.store';
import enrollmentStore from '../store/administration/enrollment.store';
import { intakeStore } from '../store/administration/intake.store';
import programStore from '../store/administration/program.store';
import { rankStore } from '../store/administration/rank.store';
import usersStore from '../store/administration/users.store';
import { ParamType, RoleResWithPrevilages, RoleType, ValueType } from '../types';
import {
  EnrollmentMode,
  EnrollUserToProgram,
  StudentApproval,
} from '../types/services/enrollment.types';
import { IntakeProgramInfo } from '../types/services/intake-program.types';
import { RankRes } from '../types/services/rank.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../utils/getOption';
import {
  enrollmentAcademySchema,
  enrollmentInfoSchema,
} from '../validations/user.validation';

interface EnrollUserToProgramIntakes extends EnrollUserToProgram {
  academy_id: string;
  program_id: string;
  intake_id: string;
}

interface EnrollmentInfoErrors
  extends Pick<EnrollUserToProgramIntakes, 'enroled_on' | 'employee_number'> {}

interface EnrollmentAcademyErrors
  extends Pick<EnrollUserToProgramIntakes, 'academy_id' | 'program_id' | 'intake_id'> {}

interface IProps {
  values: EnrollUserToProgramIntakes;
  user_roles?: RoleResWithPrevilages;
  otherDetail?: any;
  display_label: string;
  handleChange: (_e: ValueType) => any;
  handleNext: <T>(_e: FormEvent<T>) => any;
}

export default function EnrollStudents() {
  const { id } = useParams<ParamType>();
  const picked_role = usePickedRole();
  const history = useHistory();
  const { data: user } = usersStore.getUserById(id);

  const { mutate } = enrollmentStore.enrollUsersToProgram();
  const [currentStep, setCurrentStep] = useState(0);
  const [enrollStud, setEnrollStud] = useState<EnrollUserToProgramIntakes>({
    completed_on: '',
    employee_number: '',
    enroled_on: '',
    enrolment_mode: EnrollmentMode.NEW,
    enrolment_status: StudentApproval.PENDING,
    intake_program_id: '',
    other_rank: '',
    rank_id: '',
    rank_institution: '',
    third_party_reg_number: '',
    user_id: '',
    academy_id: '',
    program_id: '',
    intake_id: '',
  });

  function handleChange(e: ValueType) {
    setEnrollStud((enrol) => ({
      ...enrol,
      [e.name]: e.value,
    }));
  }

  useEffect(() => {
    setEnrollStud((stud) => ({
      ...stud,
      user_id: id,
    }));
  }, [id]);

  useEffect(() => {
    setEnrollStud((stud) => ({
      ...stud,
      academy_id: picked_role?.academy_id + '',
    }));
  }, [picked_role?.academy_id]);

  useEffect(() => {
    setEnrollStud((stud) => ({
      ...stud,
      intake_program_id: stud.intake_id + '',
    }));
  }, [enrollStud.intake_id]);

  useEffect(() => {
    setEnrollStud((stud) => ({
      ...stud,
      employee_number: user?.data.data.person?.service_number || '',
    }));
  }, [user?.data.data.person?.service_number]);

  useEffect(() => {
    setEnrollStud((stud) => ({
      ...stud,
      rank_id: user?.data.data.person?.current_rank?.id.toString() || '',
    }));
  }, [user?.data.data.person?.current_rank?.id]);

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (currentStep === 0) setCurrentStep(currentStep + 1);
    else {
      await mutate(enrollStud, {
        onSuccess(data) {
          toast.success(data.data.message);
          history.goBack();
        },
        onError(error: any) {
          toast.error(error.response.data.message);
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
        <EnrollmentInfo
          display_label="info"
          values={enrollStud}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
        <EnrollmentAcademy
          display_label="more"
          values={enrollStud}
          user_roles={picked_role}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
      </Stepper>
    </div>
  );
}

function EnrollmentInfo({ values, handleChange, handleNext }: IProps) {
  const ranks: RankRes[] | undefined = rankStore.getRanks().data?.data.data;
  const initialErrorState: EnrollmentInfoErrors = {
    enroled_on: '',
    employee_number: '',
  };

  const [errors, setErrors] = useState<EnrollmentInfoErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = enrollmentInfoSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => handleNext(e))
      .catch((err) => {
        const validatedErr: EnrollmentInfoErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof EnrollmentInfoErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <DateMolecule
        error={errors.enroled_on}
        handleChange={handleChange}
        startYear={moment().year() - 20}
        endYear={moment().year()}
        reverse={false}
        name="enroled_on"
        width="60 md:w-80">
        Enrollment date
      </DateMolecule>
      <InputMolecule
        error={errors.employee_number}
        required={false}
        name="employee_number"
        value={values.employee_number}
        handleChange={handleChange}>
        Service number
      </InputMolecule>
      <DropdownMolecule
        name="enrolment_mode"
        handleChange={handleChange}
        defaultValue={getDropDownStatusOptions(EnrollmentMode).find(
          (enrol) => enrol.value === values.enrolment_mode,
        )}
        value={values.enrolment_mode}
        options={getDropDownStatusOptions(EnrollmentMode)}
        placeholder="Select enrolment mode">
        Enrollment mode
      </DropdownMolecule>
      <DropdownMolecule
        placeholder="Select current rank"
        name="rank_id"
        options={getDropDownOptions({ inputs: ranks || [] })}
        value={values.rank_id}
        handleChange={handleChange}>
        User Rank
      </DropdownMolecule>
      <div className="pt-3">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

function EnrollmentAcademy({ values, user_roles, handleChange, handleNext }: IProps) {
  const academies = academyStore.fetchAcademies();
  const programs = programStore.getProgramsByAcademy(values.academy_id) || [];
  const intakes = intakeStore.getIntakesByProgram(values.program_id) || [];
  const { t } = useTranslation();

  const initialErrorState: EnrollmentAcademyErrors = {
    academy_id: '',
    program_id: '',
    intake_id: '',
  };

  const [errors, setErrors] = useState<EnrollmentAcademyErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cloneValues = { ...values };
    Object.assign(cloneValues, {
      has_academy: user_roles?.type === RoleType.INSTITUTION,
    });
    const validatedForm = enrollmentAcademySchema.validate(cloneValues, {
      abortEarly: false,
    });

    validatedForm
      .then(() => handleNext(e))
      .catch((err) => {
        const validatedErr: EnrollmentAcademyErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof EnrollmentAcademyErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {user_roles?.type === RoleType.INSTITUTION && (
        <SelectMolecule
          error={errors.academy_id}
          options={getDropDownOptions({ inputs: academies.data?.data.data || [] })}
          name="academy_id"
          loading={academies.isLoading}
          value={values.academy_id}
          handleChange={handleChange}>
          Academy
        </SelectMolecule>
      )}
      <SelectMolecule
        error={errors.program_id}
        options={getDropDownOptions({ inputs: programs.data?.data.data || [] })}
        name="program_id"
        placeholder={
          programs.isLoading
            ? 'Loading' + t('Program') + '...'
            : t('Program') + ' to be enrolled in'
        }
        value={values.program_id}
        handleChange={handleChange}>
        {t('Program')}
      </SelectMolecule>
      <SelectMolecule
        error={errors.intake_id}
        options={getDropDownOptions({
          inputs: intakes.data?.data.data || [],
          labelName: ['intake_id'],
          //@ts-ignore
          getOptionLabel: (intake: IntakeProgramInfo) => intake.intake.title,
        })}
        name="intake_id"
        value={values.intake_id}
        placeholder={
          intakes.isLoading ? 'Loading intakes...' : 'intake to be enrolled in'
        }
        handleChange={handleChange}>
        Intake
      </SelectMolecule>
      <div className="pt-3">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
