import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { timetableStore } from '../../../../store/timetable/timetable.store';
import { ValueType } from '../../../../types';
import { ICreateFootNote } from '../../../../types/services/schedule.types';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';

interface ParamType {
  itemId: string;
}

interface IProps {
  levelId?: string;
}

export default function NewFootNote({ levelId }: IProps) {
  const { itemId } = useParams<ParamType>();
  const history = useHistory();

  const [values, setvalues] = useState<ICreateFootNote>({
    activityId: itemId,
    footNote: '',
  });

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  const { mutateAsync, isLoading } = timetableStore.createTimetableActivityFootnote();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutateAsync(values, {
      async onSuccess(_data) {
        queryClient.invalidateQueries(['timetable/weeks', levelId]);
        queryClient.invalidateQueries(['timetable/week/current/:id', levelId]);
        toast.success('Footnote was created successfully');
        history.goBack();
      },
      onError(error: any) {
        toast.error(error.response.data.message || 'error occurred please try again');
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        name="footNote"
        placeholder="Foot note"
        handleChange={handleChange}
        value={values.footNote}>
        Foot note
      </InputMolecule>
      <Button isLoading={isLoading} type="submit">
        Save
      </Button>
    </form>
  );
}
