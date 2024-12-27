import React from 'react';
import { useParams } from 'react-router-dom';

import NewTimeTable from './NewTimeTable';

interface ParamType {
  id: string;
  itemId: string;
}

export default function EditTimeTable() {
  const { itemId } = useParams<ParamType>();

  return <NewTimeTable activityId={itemId} isUpdating />;
}
