import { NotificationType } from '../types/services/notification.types';

/**
 *
 * @param notificationType : NotificationType
 * @param id: string
 * @returns string with the link to the notification attribute
 */
export function linkConstructor(notificationType: NotificationType, id: string) {
  return notificationType.toString().replace(/:id/, id);
}
