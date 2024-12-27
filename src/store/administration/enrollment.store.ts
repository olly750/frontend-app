import { useMutation, useQuery } from 'react-query';

import { enrollmentService } from '../../services/administration/enrollments.service';
import { FilterOptions } from '../../types';
import {
  ModuleAssignmentType,
  StudentApproval,
} from '../../types/services/enrollment.types';
import { PromotionStatus } from '../../types/services/intake-program.types';
import { formatQueryParameters } from '../../utils/query';

class EnrolmmentStore {
  getInstructorLevels(instructorId: string) {
    return useQuery(['instructor/levels', instructorId], () =>
      enrollmentService.getInstructorLevel(instructorId),
    );
  }

  getInstructorIntakeProgramsById(instructorId: string) {
    return useQuery(['instructor/intakeprogram', instructorId], () =>
      enrollmentService.getInstructorIntakeProgramsById(instructorId),
    );
  }

  getModulesByInstructorId(instructorId: string) {
    return useQuery(['instructor/modules', instructorId], () =>
      enrollmentService.getModulesByInstructorId(instructorId),
    );
  }

  getModuleAssignmentByIntakeProgramAndModule(data: ModuleAssignmentType) {
    return useQuery(['instructor/module/assignment', data], () =>
      enrollmentService.getModuleAssignmentByIntakeProgramAndModule(data),
    );
  }

  getInstructorsByModule(moduleId: string) {
    return useQuery(['instructors/module', moduleId], () =>
      enrollmentService.getInstructorsByModuleId(moduleId),
    );
  }

  getInstructorsBySubject(subjectId: string) {
    return useQuery(['instructors/subject', subjectId], () =>
      enrollmentService.getInstructorsBySubjectId(subjectId),
    );
  }

  getSubjectsByInstructor(instructorId: string) {
    return useQuery(['subjects/instructors', instructorId], () =>
      enrollmentService.getSubjectsByInstructor(instructorId),
    );
  }
  getInstructorsInProgram(intakeProgram: string | number) {
    return useQuery(['instructorsInIntakeprogram/IntakeProgram', intakeProgram], () =>
      enrollmentService.getInstructorsInProgram(intakeProgram),
    );
  }

  getInstructorsInProgramLevel(levelId: string) {
    return useQuery(['instructors/levelsEnrolled', levelId], () =>
      enrollmentService.getInstructorEnrollmentLevelByLevelId(levelId),
    );
  }

  getStudentsAcademy(academyId: string) {
    return useQuery(['student/academy', academyId], () =>
      enrollmentService.getStudentAcademy(academyId),
    );
  }
  getAllStudentEnrollmentsByPromotionStatus(
    academyId: string,
    promotionStatus: PromotionStatus,
  ) {
    return useQuery(['student/academy/free-enrolments'], () =>
      enrollmentService.getAllStudentEnrollmentsByPromotionStatus(
        academyId,
        promotionStatus,
      ),
    );
  }

  getStudentsOrderedByRank(queryParams?: FilterOptions) {
    return useQuery(['students', formatQueryParameters(queryParams)], () =>
      enrollmentService.getStudentsOrderedByRank(queryParams),
    );
  }
  getInstructorsOrderedByRank(queryParams?: FilterOptions) {
    return useQuery(['instructors', formatQueryParameters(queryParams)], () =>
      enrollmentService.getInstructorsOrderedByRank(queryParams),
    );
  }

  getInstructorByAcademyOrderedByRank(academyId: string, queryParams?: FilterOptions) {
    return useQuery(['instructors/academy', formatQueryParameters(queryParams)], () =>
      enrollmentService.getInstructorByAcademyOrderedByRank(academyId, queryParams),
    );
  }

  getStudentAcademyAndEnrollmentStatus(
    academyId: string,
    enrolmentStatus: StudentApproval,
  ) {
    return useQuery(['student/academy/enrolment', academyId, enrolmentStatus], () =>
      enrollmentService.getStudentAcademyAndEnrollmentStatus(academyId, enrolmentStatus),
    );
  }
  getAllStudentEnrollments(queryParams?: FilterOptions) {
    return useQuery(['student/enrolments', formatQueryParameters(queryParams)], () =>
      enrollmentService.getAllStudentEnrollments(queryParams),
    );
  }

  getAllStudentLevelEnrolment(studentId: string) {
    return useQuery(['student/enrolments', studentId], () =>
      enrollmentService.getAllStudentLevelEnrolment(studentId),
    );
  }
  
  getSimplifiedStudentLevelEnrolments(studentId: string) {
    return useQuery(['student/enrolments', studentId], () =>
      enrollmentService.getSimplifiedStudentLevelEnrolments(studentId),
    { enabled: !!studentId,
    }
    );
  }

  getStudentsWhoAreNotInAnyClassInLevel(
    academicYearProgramIntakeLevelId: string,
    intakeAcademicYearPeriodId: string,
  ) {
    return useQuery(
      [
        'student/academicYearProgramIntakeLevelId/intakeAcademicYearPeriodId',
        academicYearProgramIntakeLevelId,
        intakeAcademicYearPeriodId,
      ],
      () =>
        enrollmentService.getStudentsWhoAreNotInAnyClassInLevel(
          academicYearProgramIntakeLevelId,
          intakeAcademicYearPeriodId,
        ),
    );
  }

  getInstructorsonModule(courseId: string | number) {
    return useQuery(['instructorsinModule/ModuleId', courseId], () =>
      enrollmentService.getInstructorAssignedmodule(courseId),
    );
  }

  enrollStudentsToLevel() {
    return useMutation(enrollmentService.enrollStudentsToLevel);
  } /* Enrolling users to a program. */

  enrollUsersToProgram() {
    return useMutation(enrollmentService.enrollUsersToProgram);
  }
  enrollStudentToProgram() {
    return useMutation(enrollmentService.enrollStudentToProgram);
  }
  enrollInstructorToProgram() {
    return useMutation(enrollmentService.enrollInstructorToProgram);
  }
  enrollInstructorToModule() {
    return useMutation(enrollmentService.enrollInstructorToModule);
  }

  enrollInstructorToSubject() {
    return useMutation(enrollmentService.enrollInstructorToSubject);
  }

  enrollInstructorToLevel() {
    return useMutation(enrollmentService.enrollInstructorToLevel);
  }
  approveStudent() {
    return useMutation(enrollmentService.approveStudent);
  }
}

export function getStudentsByAcademyOrderedByRank(
  academyId?: string,
  queryParams?: FilterOptions,
) {
  return useQuery(
    ['students/academy', academyId, formatQueryParameters(queryParams)],
    () =>
      enrollmentService.getStudentsByAcademyOrderedByRank(academyId || '', queryParams),
    { enabled: !!academyId },
  );
}

export function getInstructorIntakePrograms(instructorId: string) {
  return useQuery(
    ['instructor/program', instructorId],
    () => enrollmentService.getInstructorIntakePrograms(instructorId),
    { enabled: !!instructorId },
  );
}

export default new EnrolmmentStore();
