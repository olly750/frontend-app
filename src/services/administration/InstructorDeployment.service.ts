import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { FilterOptions, Response, SortedContent } from '../../types';
import {
  DeployInstructor,
  Instructor,
  InstructorDeployed,
} from '../../types/services/instructor.types';
import { UserInfo } from '../../types/services/user.types';
import { formatQueryParameters } from '../../utils/query';

class InstructorDeployment {
  public async getInstructorsDeployedInAcademy(
    academyId: string,
  ): Promise<AxiosResponse<Response<InstructorDeployed[]>>> {
    return await adminstrationAxios.get(
      `instructorDeployments/getInstructorsDeployedInAcademy/${academyId}`,
    );
  }

  public async searchInstructorByAcademy(
    academyId: string,
    query: string,
    options?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Instructor[]>>>> {
    return await adminstrationAxios.get(
      `/instructorDeployments/searchInstructorByAcademy/${academyId}?query=${query}&${formatQueryParameters(
        options,
      )}`,
    );
  }

  public async getInstructorByAcademyOrderedByRank(
    academyId?: string,
    options?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Instructor[]>>>> {
    return await adminstrationAxios.get(
      `instructorDeployments/getInstructorByAcademyOrderedByRank/${academyId}?${formatQueryParameters(
        options,
      )}`,
    );
  }

  public async getInstructorsRegisteredInAcademy(
    academyId: string,
  ): Promise<AxiosResponse<Response<Instructor[]>>> {
    return await adminstrationAxios.get(
      `instructorDeployments/getInstructorsRegisteredInAcademy/${academyId}`,
    );
  }

  public async getUsersSortedByRanks(
    ids: string[],
  ): Promise<AxiosResponse<Response<UserInfo[]>>> {
    return await adminstrationAxios.post(`users/rankUsersByRanks`, {
      ids,
    });
  }

  public async getInstructorById(
    id: string,
  ): Promise<AxiosResponse<Response<Instructor>>> {
    return await adminstrationAxios.get(`instructorDeployments/getInstructorById/${id}`);
  }

  public async getInstructorByUserId(
    userId: string,
  ): Promise<AxiosResponse<Response<Instructor[]>>> {
    return await adminstrationAxios.get(
      `instructorDeployments/getInstructorByUserId/${userId}`,
    );
  }

  public async getInstructors(): Promise<AxiosResponse<Response<Instructor[]>>> {
    return await adminstrationAxios.get(`instructorDeployments/getInstructors`);
  }

  public async deploy(
    instructor: DeployInstructor,
  ): Promise<AxiosResponse<Response<InstructorDeployed>>> {
    return await adminstrationAxios.post('instructorDeployments/deploy', instructor);
  }
}

export const instructorDeployment = new InstructorDeployment();
