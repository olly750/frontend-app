import { useMutation, useQuery } from 'react-query';

import { intakeService } from '../../services/administration/intake.service';

class IntakeStore {
  create() {
    return useMutation(intakeService.create);
  }
  update() {
    return useMutation(intakeService.update);
  }
  addPrograms() {
    return useMutation(intakeService.addPrograms);
  }
  modifyIntakeProgram() {
    return useMutation(intakeService.modifyIntakeProgram);
  }

  getAll(registrationControlId?: string) {
    if (registrationControlId)
      return useQuery(['intakes/registrationControl', registrationControlId], () =>
        intakeService.getIntakesPyRegistrationControl(registrationControlId),
      );
    else return useQuery('intakes', intakeService.fetchAll);
  }
  getIntakeById(intakeId: string, enabled = true) {
    return useQuery(
      ['intakes/id', intakeId],
      () => intakeService.getIntakeById(intakeId),
      { enabled },
    );
  }

  getIntakesByRegControl(regControlId: string) {
    return useQuery(['intakes/regcontrol', regControlId], () =>
      intakeService.getIntakesByRegControl(regControlId),
    );
  }

  getIntakesByProgram(programId: string, enabled = true) {
    return useQuery(
      ['intakes/programs', programId],
      () => intakeService.getIntakesByProgram(programId),
      { enabled },
    );
  }

  getIntakesByRegistrationControl(registrationControlId: string) {
    return useQuery(
      ['intakes/programs', registrationControlId],
      () => intakeService.getIntakesPyRegistrationControl(registrationControlId),
      { enabled: false },
    );
  }
}

export function getIntakesByAcademy(id: string, fetchByReg = false) {
  if (fetchByReg)
    return useQuery(
      ['intakes/registrationControl', id],
      () => intakeService.getIntakesPyRegistrationControl(id),
      { enabled: !!id && id !== 'undefined' },
    );
  else
    return useQuery(
      ['intakes/academy', id],
      () => intakeService.getIntakesByAcademy(id),
      { enabled: !!id && id !== 'undefined' },
    );
}

export function getProgramCountsByAcademicId(id: string) {
  return useQuery(['intakes/getProgramCountsByAcademicId', id], () =>
    intakeService.getProgramCountsByAcademicId(id),
  );
}

export function getProgramCounts() {
  return useQuery(['intakes/getProgramCounts'], () => intakeService.getProgramCounts());
}

export function getInstructorsInInProgram(programId: string, enabled = true) {
  return useQuery(
    ['programsIntake/id', programId],
    () => intakeService.getProgramsByIntake(programId),
    { enabled },
  );
}

export function getProgramsByIntake(intakeId: string, enabled = true) {
  return useQuery(
    ['programsIntake/id', intakeId],
    () => intakeService.getProgramsByIntake(intakeId),
    { enabled },
  );
}

export const intakeStore = new IntakeStore();
