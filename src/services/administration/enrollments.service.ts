import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { FilterOptions, Response, SortedContent } from '../../types';
import {
  ApproveStudents,
  EnrollInstructorLevel,
  EnrollInstructorLevelInfo,
  EnrollInstructorProgram,
  EnrollInstructorToSubject,
  EnrollInstructorToSubjectInfo,
  EnrollStudentToLevel,
  EnrollStudentToProgram,
  EnrollUserToProgram,
  InstructorAssignModule,
  ModuleAssignmentType,
  StudentApproval,
  StudentEnrollmentLevel,
  StudentsWithNoClass,
} from '../../types/services/enrollment.types';
import {
  Instructor,
  InstructorModuleAssignment,
} from '../../types/services/instructor.types';
import {
  PromotionStatus,
  StudentIntakeProgram,
} from '../../types/services/intake-program.types';
import { Student } from '../../types/services/user.types';
import { formatQueryParameters } from '../../utils/query';
import {
  EnrollInstructorToModuleInfo,
  ModuleInstructors,
} from './../../types/services/enrollment.types';
import { InstructorProgram } from './../../types/services/instructor.types';

class EnrollmentService {
  public async getInstructorLevel(
    instructorId: string,
  ): Promise<AxiosResponse<Response<EnrollInstructorLevelInfo[]>>> {
    return await adminstrationAxios.get(
      `instructorEnrolment/getInstructorEnrolmentLevelByInstructor/${instructorId}`,
    );
  }

  public async getInstructorsInProgram(
    intakeProgramId: number | string,
  ): Promise<AxiosResponse<Response<InstructorProgram[]>>> {
    return await adminstrationAxios.get(
      `instructorEnrolment/getInstructorIntakeProgramsByIntakeProgram/${intakeProgramId}`,
    );
  }

  public async getInstructorEnrollmentLevelByLevelId(
    levelId: string,
  ): Promise<AxiosResponse<Response<EnrollInstructorLevelInfo[]>>> {
    return await adminstrationAxios.get(
      `instructorEnrolment/getInstructorEnrolmentLevelByAcademicYearProgramIntakeLevel/${levelId}`,
    );
  }

  public async getInstructorIntakePrograms(
    instructorId: string,
  ): Promise<AxiosResponse<Response<InstructorProgram[]>>> {
    return await adminstrationAxios.get(
      `instructorEnrolment/getInstructorIntakePrograms/${instructorId}`,
    );
  }

  public async getInstructorIntakeProgramsById(
    intakeProgramInstructorId: string,
  ): Promise<AxiosResponse<Response<InstructorProgram>>> {
    return await adminstrationAxios.get(
      `instructorEnrolment/getInstructorIntakeProgramsById/${intakeProgramInstructorId}`,
    );
  }
  public async getInstructorAssignedmodule(
    courseModuleId: string | number,
  ): Promise<AxiosResponse<Response<InstructorModuleAssignment[]>>> {
    return await adminstrationAxios.get(
      `instructorModuleAssignment/getAllByCourseModule/${courseModuleId}`,
    );
  }

  public async getStudentAcademy(
    academyId: string,
  ): Promise<AxiosResponse<Response<Student[]>>> {
    return await adminstrationAxios.get(`students/getAccademyStudents/${academyId}`);
  }

  public async getStudentAcademyAndEnrollmentStatus(
    academyId: string,
    enrolmentStatus: StudentApproval,
  ): Promise<AxiosResponse<Response<StudentIntakeProgram[]>>> {
    return await adminstrationAxios.get(
      `students/getStudentsByAcademyAndEnrolmentStatus/${academyId}/${enrolmentStatus}`,
    );
  }

  public async getAllStudentEnrollmentsByPromotionStatus(
    academyId: string,
    promotionStatus: PromotionStatus,
  ): Promise<AxiosResponse<Response<StudentIntakeProgram[]>>> {
    return await adminstrationAxios.get(
      `/students/getStudentsByAcademyAndPromotionStatus/${academyId}/${promotionStatus}`,
    );
  }

  public async getStudentsOrderedByRank(
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Student[]>>>> {
    return await adminstrationAxios.get(
      `students/getStudentsOrderedByRank?${formatQueryParameters(queryParams)}`,
    );
  }

  public async getInstructorsOrderedByRank(
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Instructor[]>>>> {
    return await adminstrationAxios.get(
      `instructorDeployments/getInstructorsOrderedByRank?${formatQueryParameters(
        queryParams,
      )}`,
    );
  }

  public async getStudentsByAcademyOrderedByRank(
    academyId: string,
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Student[]>>>> {
    return await adminstrationAxios.get(
      `students/getStudentsByAcademyOrderedByRank/${academyId}?${formatQueryParameters(
        queryParams,
      )}`,
    );
  }

  public async searchStudentsByAcademy(
    academyId: string,
    query: string,
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Student[]>>>> {
    return await adminstrationAxios.get(
      `/students/searchStudentsByAcademy/${academyId}?query=${query}&${formatQueryParameters(
        queryParams,
      )}`,
    );
  }

  public async getInstructorByAcademyOrderedByRank(
    academyId: string,
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<Instructor[]>>>> {
    return await adminstrationAxios.get(
      `instructorDeployments/getInstructorByAcademyOrderedByRank/${academyId}?${formatQueryParameters(
        queryParams,
      )}`,
    );
  }

  public async getAllStudentEnrollments(
    queryParams?: FilterOptions,
  ): Promise<AxiosResponse<Response<SortedContent<StudentEnrollmentLevel[]>>>> {
    return await adminstrationAxios.get(
      `students/getAllStudentLevelEnrolments?${formatQueryParameters(queryParams)}`,
    );
  }

  public async getAllStudentLevelEnrolment(
    studentId: string,
  ): Promise<AxiosResponse<Response<[]>>> {
    return await adminstrationAxios.get(
      `students/getAllStudentLevelEnrolment/${studentId}`,
    );
  }
  public async getSimplifiedStudentLevelEnrolments(
    studentId: string,
  ): Promise<AxiosResponse<Response<[]>>> {
    return await adminstrationAxios.get(
      `students/getAllSimplifiedStudentLevelEnrolment/${studentId}`,
    );
  }

  public async getStudentsWhoAreNotInAnyClassInLevel(
    academicYearProgramIntakeLevelId: string,
    intakeAcademicYearPeriodId: string,
  ): Promise<AxiosResponse<Response<StudentsWithNoClass[]>>> {
    return await adminstrationAxios.get(
      `students/getStudentsWhoAreNotInAnyClassInLevel/${academicYearProgramIntakeLevelId}/${intakeAcademicYearPeriodId}`,
    );
  }

  public async enrollStudentsToLevel(
    newStudent: EnrollStudentToLevel,
  ): Promise<AxiosResponse<Response<StudentEnrollmentLevel>>> {
    return await adminstrationAxios.post(
      `students/enrolStudentInIntakeProgramLevel`,
      newStudent,
    );
  }

  public async enrollUsersToProgram(
    newUser: EnrollUserToProgram,
  ): Promise<AxiosResponse<Response<StudentEnrollmentLevel>>> {
    return await adminstrationAxios.post(`students/enrolUserInIntakeProgram`, newUser);
  }

  public async enrollStudentToProgram(
    newStudent: EnrollStudentToProgram,
  ): Promise<AxiosResponse<Response<StudentIntakeProgram>>> {
    return await adminstrationAxios.post(
      `students/enrolStudentInIntakeProgram`,
      newStudent,
    );
  }

  public async enrollInstructorToProgram(
    instructor: EnrollInstructorProgram,
  ): Promise<AxiosResponse<Response<InstructorProgram>>> {
    return await adminstrationAxios.post(
      'instructorEnrolment/enroleInProgram',
      instructor,
    );
  }

  public async enrollInstructorToModule(
    instructor: InstructorAssignModule,
  ): Promise<AxiosResponse<Response<InstructorProgram>>> {
    return await adminstrationAxios.post(
      'instructorModuleAssignment/assignInstructorOnModule',
      instructor,
    );
  }

  public async enrollInstructorToSubject(
    instructor: EnrollInstructorToSubject,
  ): Promise<AxiosResponse<Response<EnrollInstructorToSubjectInfo>>> {
    return await adminstrationAxios.post(
      'instructorSubjectAssignment/assignInstructorOnSubject',
      instructor,
    );
  }

  public async enrollInstructorToLevel(
    instructor: EnrollInstructorLevel,
  ): Promise<AxiosResponse<Response<Instructor>>> {
    return await adminstrationAxios.post('instructorEnrolment/enroleInLevel', instructor);
  }

  public async getModulesByInstructorId(
    instructorId: string,
  ): Promise<AxiosResponse<Response<EnrollInstructorToModuleInfo[]>>> {
    return await adminstrationAxios.get(
      `instructorModuleAssignment/getAllByInstructor/${instructorId}`,
    );
  }

  public async getInstructorsByModuleId(
    moduleId: string,
  ): Promise<AxiosResponse<Response<ModuleInstructors[]>>> {
    return await adminstrationAxios.get(
      `instructorModuleAssignment/getAllInstructorsAssignedOnModule/${moduleId}`,
    );
  }

  public async getModuleAssignmentByIntakeProgramAndModule(
    data: ModuleAssignmentType,
  ): Promise<AxiosResponse<Response<EnrollInstructorToSubjectInfo>>> {
    return await adminstrationAxios.get(
      `instructorModuleAssignment/getByIntakeProgramInstructorAndCourseModule/${data.intakeProg}/${data.module_id}`,
    );
  }

  public async getInstructorsBySubjectId(
    subjectId: string,
  ): Promise<AxiosResponse<Response<ModuleInstructors[]>>> {
    if (!subjectId || subjectId === '' || subjectId === 'undefined')
      return new Promise(() => {});

    return await adminstrationAxios.get(
      `instructorSubjectAssignment/getAllInstructorsAssignedOnSubject/${subjectId}`,
    );
  }

  public async getSubjectsByInstructor(
    instructorId: string,
  ): Promise<AxiosResponse<Response<EnrollInstructorToSubjectInfo[]>>> {
    return await adminstrationAxios.get(
      `instructorSubjectAssignment/getAllByInstructor/${instructorId}`,
    );
  }

  public async approveStudent(
    student: ApproveStudents,
  ): Promise<AxiosResponse<Response<StudentIntakeProgram>>> {
    return await adminstrationAxios.put(
      'students/changeIntakeProgramStudentEnrolmentStatus',
      student,
    );
  }
}

export const enrollmentService = new EnrollmentService();
