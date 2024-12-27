import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { timetableStore } from '../../../../store/timetable/timetable.store';
import { ParamType, ValueType } from '../../../../types';
import { ICreateTimeTableWeek } from '../../../../types/services/schedule.types';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';

export default function NewWeek() {
  const { id } = useParams<ParamType>();
  const history = useHistory();

  const [values, setvalues] = useState<ICreateTimeTableWeek>({
    endDate: '',
    intakeLevelId: Number(id),
    startDate: new Date().toDateString(),
    weekName: 'Week one',
  });

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  const { mutateAsync, isLoading } = timetableStore.createTimetableWeek();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutateAsync(values, {
      async onSuccess(_data) {
        toast.success('Week was created successfully');
        queryClient.invalidateQueries(['timetable/weeks', id]);
        history.goBack();
      },
      onError(error: any) {
        toast.error(error.response.data.message || 'error occurred please try again');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <InputMolecule name="weekName" value={values.weekName} handleChange={handleChange}>
        Week name
      </InputMolecule>
      <InputMolecule
        type="date"
        value={values.startDate}
        name="startDate"
        handleChange={handleChange}>
        Start date
      </InputMolecule>
      <InputMolecule
        name="endDate"
        type="date"
        value={values.endDate}
        handleChange={handleChange}>
        End date
      </InputMolecule>
      <div className="pt-1">
        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
