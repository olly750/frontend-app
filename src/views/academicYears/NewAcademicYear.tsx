import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import DateMolecule from '../../components/Molecules/input/DateMolecule';
import RadioMolecule from '../../components/Molecules/input/RadioMolecule';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import academicyearsStore from '../../store/administration/academicyears.store';
import { ValueType } from '../../types';
import {
  AcademicYearErrors,
  IAcademicYearStatus,
  ICreateAcademicYear,
} from '../../types/services/academicyears.types';
import { getDropDownStatusOptions } from '../../utils/getOption';
import { academicYearSchema } from '../../validations/program.validation';

export default function NewAcademicYear() {
  const history = useHistory();
  const picked_role = usePickedRole();
  const [newYear, setNewYear] = useState<ICreateAcademicYear>({
    academyId: picked_role?.academy_id + '',
    name: '',
    id: '',
    actualAtartOn: '',
    actualEndOn: '',
    status: IAcademicYearStatus.INITIAL,
    plannedStartOn: '',
    plannedEndOn: '',
  });

  const initialErrorState: AcademicYearErrors = {
    plannedStartOn: '',
    plannedEndOn: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    setNewYear((prev) => ({ ...prev, academyId: picked_role?.academy_id + '' }));
  }, [picked_role?.academy_id]);

  function handleChange(e: ValueType) {
    setNewYear((year) => ({ ...year, [e.name]: e.value }));
  }
  const { mutate } = academicyearsStore.createAcademy();

  function submitForm(e: FormEvent) {
    e.preventDefault();

    const validatedForm = academicYearSchema.validate(newYear, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        let name = `YEAR ${moment(
          newYear.plannedStartOn === '' ? undefined : newYear.plannedStartOn,
        ).year()}-${moment(
          newYear.plannedEndOn === '' ? undefined : newYear.plannedEndOn,
        ).year()}`;
        let data = {
          ...newYear,
          name,
        };
        mutate(data, {
          onSuccess: (year) => {
            toast.success('Academic year created', { duration: 5000 });
            queryClient.invalidateQueries(['academicyears']);
            history.push(`/dashboard/academic-years/${year.data.data.id}/period/add`);
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
      })
      .catch((err) => {
        const validatedErr: AcademicYearErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof AcademicYearErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      {/* <InputMolecule required value={years.name} name="name" handleChange={handleChange}>
        Name
      </InputMolecule> */}
      <DateMolecule
        error={errors.plannedStartOn}
        startYear={moment().year() - 30}
        endYear={moment().year() + 30}
        reverse={false}
        handleChange={handleChange}
        name={'plannedStartOn'}>
        Start Date
      </DateMolecule>

      <DateMolecule
        error={errors.plannedEndOn}
        handleChange={handleChange}
        startYear={moment(
          newYear.plannedStartOn === '' ? undefined : newYear.plannedStartOn,
        ).year()}
        endYear={moment().year() + 30}
        reverse={false}
        name={'plannedEndOn'}>
        End Date
      </DateMolecule>

      <RadioMolecule
        className="mt-4"
        value={newYear.status}
        name="status"
        options={getDropDownStatusOptions(IAcademicYearStatus)}
        handleChange={handleChange}>
        Status
      </RadioMolecule>

      <div className="mt-5">
        <Button type="submit" full>
          Save
        </Button>
      </div>
    </form>
  );
}
