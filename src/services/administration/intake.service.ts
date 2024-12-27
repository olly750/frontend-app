import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  ExtendedIntakeInfo,
  IntakeInfo,
  IntakePrograms,
  IntakeProgramsCreate,
  ProgramIntakes,
  UpdateIntakeProgram,
} from '../../types/services/intake.types';
import { IntakeProgramInfo } from '../../types/services/intake-program.types';

class IntakeService {
  public async create(
    intake: IntakeInfo,
  ): Promise<AxiosResponse<Response<ExtendedIntakeInfo>>> {
    return await adminstrationAxios.post('/intakes/addIntake', intake);
  }
  public async update(intake: IntakeInfo): Promise<AxiosResponse<Response<IntakeInfo>>> {
    return await adminstrationAxios.put('/intakes/modifyIntake', intake);
  }
  public async addPrograms(
    intakePrograms: IntakeProgramsCreate,
  ): Promise<AxiosResponse<Response<IntakePrograms>>> {
    return await adminstrationAxios.post('/intakes/addPrograms', intakePrograms);
  }
  public async modifyIntakeProgram(
    intakeProgram: UpdateIntakeProgram,
  ): Promise<AxiosResponse<Response<IntakePrograms>>> {
    return await adminstrationAxios.put('/intakes/updateIntakeProgram', intakeProgram);
  }
  public async fetchAll(): Promise<AxiosResponse<Response<ExtendedIntakeInfo[]>>> {
    return await adminstrationAxios.get('/intakes/getIntakes');
  }

  public async getIntakeById(id: string): Promise<AxiosResponse<Response<IntakeInfo>>> {
    return await adminstrationAxios.get(`/intakes/getIntakeById/${id}`);
  }
  public async getIntakesByAcademy(
    id: string,
  ): Promise<AxiosResponse<Response<ExtendedIntakeInfo[]>>> {
    return await adminstrationAxios.get(`/intakes/getIntakesByAcademy/${id}`);
  }

  public async getProgramCountsByAcademicId(
    id: string,
  ): Promise<AxiosResponse<Response<[]>>> {
    return await adminstrationAxios.get(`/intakes/getProgramCountsByAcademicId/${id}`);
  }

  public async getProgramCounts(): Promise<AxiosResponse<Response<[]>>> {
    return await adminstrationAxios.get(`/intakes/getProgramCounts/`);
  }

  public async getIntakesByRegControl(
    id: string,
  ): Promise<AxiosResponse<Response<ExtendedIntakeInfo[]>>> {
    return await adminstrationAxios.get(`/intakes/getIntakesByRegistrationControl/${id}`);
  }

  public async getProgramsByIntake(
    intakeId: string,
  ): Promise<AxiosResponse<Response<IntakeProgramInfo[]>>> {
    return await adminstrationAxios.get(`/intakes/getProgramsByIntake/${intakeId}`);
  }

  public async getIntakesByProgram(
    programId: string,
  ): Promise<AxiosResponse<Response<IntakeProgramInfo[]>>> {
    return await adminstrationAxios.get(`/intakes/getIntakesByProgram/${programId}`);
  }

  public async getIntakesPyRegistrationControl(
    registrationControlId: string,
  ): Promise<AxiosResponse<Response<ExtendedIntakeInfo[]>>> {
    return await adminstrationAxios.get(
      `/intakes/getIntakesByRegistrationControl/${registrationControlId}`,
    );
  }
}

export const intakeService = new IntakeService();
