import { useEffect, useState } from 'react';

import { getClassById } from '../store/administration/class.store';
import { SelectData } from '../types';

export function useClasses(classId: string): SelectData {
  const { data } = getClassById(classId);

  const [classInfo, setclassInfo] = useState<SelectData>({
    value: '',
    label: '',
  });

  useEffect(() => {
    setclassInfo({
      value: data?.data.data.id.toString() || '',
      label: data?.data.data.class_name || '',
    });
  }, [data?.data.data]);

  return classInfo;
}
