import { useMutation, useQuery } from 'react-query';

import { programService } from '../../services/administration/program.service';

class ProgramStore {
  createProgram() {
    return useMutation(programService.createProgram);
  }
  addProgramToLevel() {
    return useMutation(programService.addProgramToLevel);
  }
  addProgramSyllabus() {
    return useMutation(programService.addProgramSyllabus);
  }
  fetchPrograms() {
    return useQuery('programs', programService.fetchPrograms);
  }
  getProgramById(id: string, enabled: boolean = true) {
    return useQuery(['programs/id', id], () => programService.getProgramById(id), {
      enabled,
    });
  }
  getModulesByProgram(program_id: string) {
    return useQuery(['modules/program_id', program_id], () =>
      programService.getModulesByProgram(program_id),
    );
  }

  getProgramsByDepartment(program_id: string) {
    return useQuery(['programs/program_id', program_id], () =>
      programService.getProgramsByDepartment(program_id),
    );
  }

  getProgramsByAcademy(program_id: string, enabled = true) {
    return useQuery(
      ['programs/program_id', program_id],
      () => programService.getProgramsByAcademy(program_id),
      { enabled },
    );
  }

  modifyProgram() {
    return useMutation(programService.modifyProgram);
  }
}

export function getLevelsByAcademicProgram(academicProgramId: string) {
  return useQuery(
    ['levels/program_id', academicProgramId],
    () => programService.getLevelsByAcademicProgram(academicProgramId),
    // { enabled: !!academicProgramId },
  );
}

export default new ProgramStore();
