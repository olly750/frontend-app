import { Table } from '..';

/* eslint-disable no-unused-vars */
export enum NotificationType {
  ACADEMIC_PROGRAM_INCHARGE_NOTIFIER = '/dashboard/programs/:id',
  ACADEMIC_PROGRAM_ENROLLMENT_NOTIFIER = 'ACADEMIC_PROGRAM_ENROLLMENT_NOTIFIER',
  NEW_MODULE_ASSIGNED_NOTIFIER = '/dashboard/modules/:id',
  NEW_MODULE_MATERIAL_NOTIFIER = '',
  NEW_LESSON_NOTIFIER = '',
  NEW_LEVEL_INCHARGE_NOTIFIER = '',
  APPROVAL_ON_ACADEMIC_PROGRAM_NOTIFIER = '',
  NEW_SUBJECT_ASSIGNED_NOTIFIER = '',
  NEW_ROLE_ASSIGNED_NOTIFIER = '',
  NEW_LEVEL_ASSIGNED_NOTIFIER = '',
  NEW_LEVEL_ENROLLMENT_NOTIFIER = '',
  NEW_LEVEL_PROMOTION_NOTIFIER = '',
  ADDED_TO_NEW_CLASS_NOTIFIER = '',
  APRROVAL_OF_EVALUATION_NOTIFIER = '/dashboard/evaluations/:id/approve',
  PUBLISHED_EVALUATION_NOTIFIER = '/dashboard/evaluations/view/:id',
  EVALUATION_REVIEWER_ASSIGNMENT_NOTIFIER = '/dashboard/evaluations/:id/review',
  REVIEW_OF_EVALUATION_NOTIFIER = '/dashboard/evaluations/:id/review',
  MARKING_OF_EVALUATION_NOTIFIER = '/dashboard/evaluations/:id/submissions',
  PUBLISHED_EVALUATION_RESULTS_NOTIFIER = '/dashboard/evaluations/completed/student-evaluation/:id/review`',
  EVALUATION_MARKER_ASSIGNMENT_NOTIFIER = '/dashboard/evaluations/:id/submissions',
  EVALUATION_APPROVER_ASSIGNMENT_NOTIFIER = '/dashboard/evaluations/:id/approve',
  REMINDER_TO_MARK_EVALUATION_NOTIFIER = '/dashboard/evaluations/:id/submissions',
  NEW_EVALUATION_NOTIFIER = '/dashboard/evaluations/view/:id',
  NEW_ADMISSION_TO_ACADEMY_NOTIFIER = '',
  NEW_ADMISSION_TO_INSTITUTION_NOTIFIER = '',
  NEW_SCHEDULE_NOTIFIER = '',
  NEW_TIMETABLE_NOTIFIER = '',
  MODIFIED_TIMETABLE_NOTIFIER = '',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export interface NotificationInfo extends Table {
  title: string;
  message: string;
  notification_type: NotificationType;
  notification_user_beneficiary: string;
  notification_entity_beneficiary_uuid: string;
  notification_entity_beneficiary_long: string;
  notifaction_status: NotificationStatus;
}
