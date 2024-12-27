import React from 'react';
import { toast } from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { timetableStore } from '../../../../store/timetable/timetable.store';
import Button from '../../../Atoms/custom/Button';

interface ParamType {
  weekId: string;
  id: string;
}
export default function DeleteWeek() {
  const { weekId, id } = useParams<ParamType>();

  const { mutateAsync, isLoading } = timetableStore.deleteWeek();
  const history = useHistory();

  const handleDelete = async () => {
    await mutateAsync(weekId, {
      onSuccess: () => {
        toast.success('Week deleted successfully');
        //invalidate cache
        queryClient.invalidateQueries(['timetable/weeks', id]);
        history.goBack();
      },
      onError: () => {
        toast.error('Error deleting week');
      },
    });
  };
  return (
    <div className="w-96">
      <div className="py-6">
        <div className="text-base text-gray-700">
          This action will delete the week and all the activities in it and
          <span className="font-bold">&nbsp; cannot be undone</span>.
          <p>Are you sure you want to continue?</p>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          styleType="text"
          className="bg-gray-300 text-black"
          onClick={() => history.goBack()}>
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onClick={handleDelete}
          styleType="fill"
          color="error"
          className="bg-error-500 text-white">
          Delete
        </Button>
      </div>
    </div>
  );
}
