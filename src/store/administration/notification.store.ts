import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';

import { notificationService } from '../../services/administration/notification.service';
import { Response } from '../../types';
import { NotificationInfo } from '../../types/services/notification.types';

class NotificationStore{

  updateNotificationStatus() {
    return useMutation(notificationService.updateNotifStatus);
  }
}

export function getAllNotifications(userId: string) {
  return useQuery<AxiosResponse<Response<NotificationInfo[]>>, Response>(
    ['notifications/user', userId],
    () => notificationService.fetchAll(userId),
  );
}

export const notificationStore = new NotificationStore();



