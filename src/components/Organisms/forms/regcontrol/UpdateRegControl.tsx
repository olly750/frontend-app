import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import academicyearsStore from '../../../../store/administration/academicyears.store';
import registrationControlStore, {
  fetchRegControlById,
} from '../../../../store/administration/registrationControl.store';
import { FormPropType, ParamType, ValueType } from '../../../../types';
import {
  IRegistrationControlUpdateInfo,
  RegErrors,
} from '../../../../types/services/registrationControl.types';
import { getDropDownOptions } from '../../../../utils/getOption';
import { newRegControlSchema } from '../../../../validations/regcontrol.validation';
import Button from '../../../Atoms/custom/Button';
import DateMolecule from '../../../Molecules/input/DateMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function UpdateRegControl({ onSubmit }: FormPropType) {
  const { id } = useParams<ParamType>();

  const [regControl, setRegControl] = useState<IRegistrationControlUpdateInfo>({
    academy_id: '',
    description: '',
    expected_start_date: '',
    expected_end_date: '',
    academic_year_id: '',
    id: '',
  });

  const { data: prevRegControl } = fetchRegControlById(id);

  useEffect(() => {
    setRegControl({
      academy_id: prevRegControl?.data.data.academy?.id || '',
      academic_year_id: prevRegControl?.data.data.academic_year_id || '',
      description: prevRegControl?.data.data.description || '',
      expected_start_date: prevRegControl?.data.data.expected_start_date || '',
      expected_end_date: prevRegControl?.data.data.expected_end_date || '',
      id: prevRegControl?.data.data.id.toString() || id,
    });
  }, [prevRegControl?.data.data]);

  const initialErrorState: RegErrors = {
    description: '',
    expected_start_date: '',
    expected_end_date: '',
    academic_year_id: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const { mutateAsync, isLoading } = registrationControlStore.updateRegControl();
  const history = useHistory();

  const { data } = fetchRegControlById(id);

  function handleChange({ name, value }: ValueType) {
    setRegControl((old) => ({ ...old, [name]: value }));
  }

  const { data: academy_years, isLoading: loadYears } =
    academicyearsStore.fetchAcademicYears(regControl.academy_id);

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    const validatedForm = newRegControlSchema.validate(regControl, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        let toastId = toast.loading('Creating registration period');

        mutateAsync(regControl, {
          onSuccess: () => {
            toast.success('Control updated', { id: toastId });
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
        value={regControl.description}
        name="description"
        handleChange={handleChange}>
        Registration period description
      </TextAreaMolecule>
      <DateMolecule
        error={errors.expected_start_date}
        defaultValue={regControl.expected_start_date}
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
        handleChange={handleChange}
        name={'expected_start_date'}>
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
        defaultValue={regControl.expected_end_date}
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
        <Button type="submit" disabled={isLoading} full>
          Save
        </Button>
      </div>
    </form>
  );
}
