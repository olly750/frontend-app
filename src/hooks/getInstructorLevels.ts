import { useEffect, useMemo, useState } from 'react';

import enrollmentStore from '../store/administration/enrollment.store';
import intakeProgramStore from '../store/administration/intake-program.store';
import { LevelIntakeProgram } from '../types/services/intake-program.types';

export default function useInstructorLevels(instructorId: string, intakeProgId: string) {
  const [levels, setLevels] = useState<LevelIntakeProgram[]>([]);
  const { data: getLevels } = intakeProgramStore.getLevelsByIntakeProgram(intakeProgId);

  const { data: instructorLevels } = enrollmentStore.getInstructorLevels(instructorId);

  const instructorLevelsIds = useMemo(() => {
    return instructorLevels?.data.data.map(
      (instLvl) => instLvl.academic_year_program_intake_level?.id,
    );
  }, [instructorLevels?.data.data]);

  useEffect(() => {
    setLevels(
      getLevels?.data.data.filter((inst) => instructorLevelsIds?.includes(inst.id)) || [],
    );
  }, [getLevels?.data.data, instructorLevelsIds]);

  return levels;
}
