import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import academicyearsStore from '../../../../store/administration/academicyears.store';
import registrationControlStore from '../../../../store/administration/registrationControl.store';
import { CommonFormProps, ValueType } from '../../../../types';
import {
  IRegistrationControlCreateInfo,
  RegErrors,
} from '../../../../types/services/registrationControl.types';
import { getDropDownOptions } from '../../../../utils/getOption';
import { newRegControlSchema } from '../../../../validations/regcontrol.validation';
import Button from '../../../Atoms/custom/Button';
import DateMolecule from '../../../Molecules/input/DateMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface PropType<K> extends CommonFormProps<K> {}

export default function NewRegistrationControl<E>({ onSubmit }: PropType<E>) {
  const { mutateAsync, isLoading } = registrationControlStore.createRegControl();
  const picked_role = usePickedRole();
  const history = useHistory();

  const initialErrorState: RegErrors = {
    description: '',
    expected_start_date: '',
    expected_end_date: '',
    academic_year_id: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const [regControl, setRegControl] = useState<IRegistrationControlCreateInfo>({
    academy_id: '',
    description: '',
    expected_start_date: '',
    expected_end_date: '',
    academic_year_id: '',
  });

  useEffect(() => {
    setRegControl((reg) => ({ ...reg, academy_id: picked_role?.academy_id + '' }));
  }, [picked_role?.academy_id]);

  function handleChange(e: ValueType) {
    setRegControl((regControl) => ({ ...regControl, [e.name]: e.value }));
  }

  const { data: academy_years, isLoading: loadYears } =
    academicyearsStore.fetchAcademicYears(regControl.academy_id);

  function submitForm(e: FormEvent) {
    e.preventDefault();
    const validatedForm = newRegControlSchema.validate(regControl, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        let toastId = toast.loading('Creating registration period');
        mutateAsync(regControl, {
          onSuccess: () => {
            toast.success('Registration period created', { id: toastId });
            queryClient.invalidateQueries(['regControl/academyId']);
            history.goBack();
          },
          onError: (error: any) => {
            toast.error(error.response.data.message, { id: toastId });
          },
        });

        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: RegErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof RegErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <SelectMolecule
        error={errors.academic_year_id}
        hasError={errors.academic_year_id !== ''}
        options={getDropDownOptions({ inputs: academy_years?.data.data || [] })}
        name="academic_year_id"
        placeholder="Select Academy year Period"
        loading={loadYears}
        value={regControl.academic_year_id}
        handleChange={handleChange}>
        Academy year Period
      </SelectMolecule>

      <TextAreaMolecule
        required={false}
        error={errors.description}
        value={regControl.description}
        name="description"
        handleChange={handleChange}>
        Registration period description
      </TextAreaMolecule>

      <DateMolecule
        error={errors.expected_start_date}
        startYear={
          academy_years?.data.data.find((ac) => ac.id === regControl.academic_year_id)
            ?.planned_start_on
            ? moment(
                academy_years?.data.data.find(
                  (ac) => ac.id === regControl.academic_year_id,
                )?.planned_start_on,
              ).year()
            : moment().year() - 15
        }
        endYear={
          academy_years?.data.data.find((ac) => ac.id === regControl.academic_year_id)
            ?.planned_end_on
            ? moment(
                academy_years?.data.data.find(
                  (ac) => ac.id === regControl.academic_year_id,
                )?.planned_end_on,
              ).year()
            : moment().year() + 15
        }
        reverse={false}
        handleChange={handleChange}
        name="expected_start_date">
        Start Date
      </DateMolecule>

      <DateMolecule
        error={errors.expected_end_date}
        handleChange={handleChange}
        startYear={moment(
          regControl.expected_start_date === ''
            ? undefined
            : regControl.expected_start_date,
        ).year()}
        defaultValue={
          regControl.expected_start_date === ''
            ? undefined
            : regControl.expected_start_date
        }
        endYear={
          academy_years?.data.data.find((ac) => ac.id === regControl.academic_year_id)
            ?.planned_end_on
            ? moment(
                academy_years?.data.data.find(
                  (ac) => ac.id === regControl.academic_year_id,
                )?.planned_end_on,
              ).year()
            : moment().year() + 15
        }
        reverse={false}
        name={'expected_end_date'}>
        End Date
      </DateMolecule>

      {/* <RadioMolecule
        className="mt-4"
        value="ACTIVE"
        name="status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
        handleChange={handleChange}>
        Status
      </RadioMolecule> */}

      <div className="mt-5">
        <Button type="submit" isLoading={isLoading} full>
          Save
        </Button>
      </div>
    </form>
  );
}
