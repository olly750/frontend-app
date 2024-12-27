import { useEffect, useState } from 'react';

import enrollmentStore from '../store/administration/enrollment.store';
import { moduleStore } from '../store/administration/modules.store';
import { CommonCardDataType } from '../types';
import { ModuleInfo } from '../types/services/modules.types';
import { advancedTypeChecker } from '../utils/getOption';

export default function useInstructorModules(programId: string, instructorId: string) {
  const [instModules, setInstModules] = useState<CommonCardDataType[]>([]);
  const [instProgModules, setinstProgModules] = useState<ModuleInfo[]>([]);
  const [moduleIds, setModuleIds] = useState<string[]>([]);

  const instructorModules = enrollmentStore.getModulesByInstructorId(instructorId);

  const getAllModuleStore = moduleStore.getModulesByProgram(programId);

  useEffect(() => {
    setModuleIds(
      instructorModules.data?.data.data.map((md) => md.course_module_id) || [],
    );
  }, [instructorModules.data?.data.data]);

  useEffect(() => {
    let newInstProgModule =
      getAllModuleStore.data?.data.data.filter((inst) =>
        moduleIds?.includes(inst.id + ''),
      ) || [];

    setinstProgModules(newInstProgModule);
  }, [getAllModuleStore.data?.data.data, moduleIds]);

  useEffect(() => {
    let newModules: CommonCardDataType[] = [];

    instProgModules.forEach((mod) =>
      newModules.push({
        status: {
          type: advancedTypeChecker(mod.generic_status),
          text: mod.generic_status.toString(),
        },
        id: mod.id,
        code: mod.code,
        title: mod.name,
        description: mod.description,
        subTitle: `total subject: ${mod.total_num_subjects || 'None'}`,
      }),
    );

    const uniqueArray = [...new Set(newModules)];
    setInstModules(uniqueArray);
  }, [instProgModules]);

  return { instModules, getAllModuleStore, instructorModules };
}
