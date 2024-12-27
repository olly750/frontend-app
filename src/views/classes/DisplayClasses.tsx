import React from 'react';

import Heading from '../../components/Atoms/Text/Heading';
import { getClassById } from '../../store/administration/class.store';

export default function DisplayClasses({
  classId,
  isLast,
}: {
  classId: string;
  isLast: boolean;
}) {
  const { data } = getClassById(classId);

  return (
    <Heading fontWeight="semibold" fontSize="sm">
      {data?.data.data.class_name
        ? `${data?.data.data.class_name} ${isLast ? '' : ','}`
        : ''}
    </Heading>
  );
}
