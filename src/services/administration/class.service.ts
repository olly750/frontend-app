import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { Student } from '../../types/services/user.types';
import {
  IClass,
  IClassStudent,
  ICreateClass,
  StudentsInClass,
} from './../../types/services/class.types';

class ClassService {
  public async addClass(cl: ICreateClass): Promise<AxiosResponse<Response<IClass>>> {
    return await adminstrationAxios.post('/intakeLevelClasses/addIntakeLevelClasses', cl);
  }

  public async addClassStudent(
    stud: IClassStudent,
  ): Promise<AxiosResponse<Response<Student>>> {
    return await adminstrationAxios.post('/intakeLevelClasses/addStudents', stud);
  }
  public async removeStudentInClass(
    intakeLevelClassStudentId: string,
  ): Promise<AxiosResponse<Response<IClass>>> {
    return await adminstrationAxios.delete(
      `/intakeLevelClasses/removeStudent/${intakeLevelClassStudentId}`,
    );
  }
  public async getClassById(id: string): Promise<AxiosResponse<Response<IClass>>> {
    return await adminstrationAxios.get(
      `/intakeLevelClasses/getIntakeLevelClassById/${id}`,
    );
  }

  public async getClassByPeriod(
    intakeAcademicYearPeriodId: string,
  ): Promise<AxiosResponse<Response<IClass[]>>> {
    return await adminstrationAxios.get(
      `intakeLevelClasses/getClassesByIntakeAcademicYearPeriod/${intakeAcademicYearPeriodId}`,
    );
  }
  public async getClassByStudentAndLevel(
    studentId: string,
    intakeProgramlevelId: string,
  ): Promise<AxiosResponse<Response<IClass[]>>> {
    return await adminstrationAxios.get(
      `intakeLevelClasses/getClassesByStudentAndIntakeprogramLevel/${studentId}/${intakeProgramlevelId}`,
    );
  }

  public async getAllClasses(): Promise<AxiosResponse<Response<IClass[]>>> {
    return await adminstrationAxios.get(`/intakeLevelClasses/getIntakeLevelClasses`);
  }
  public async getStudentsByClass(
    classId: string,
  ): Promise<AxiosResponse<Response<StudentsInClass[]>>> {
    return await adminstrationAxios.get(
      `/intakeLevelClasses/getStudentsByClass/${classId}`,
    );
  }
  public async modifyClass(cl: ICreateClass): Promise<AxiosResponse<Response<IClass>>> {
    return await adminstrationAxios.put('/intakeLevelClasses/modifyIntakeLevelClasses', {
      ...cl,
    });
  }
}

export const classService = new ClassService();
