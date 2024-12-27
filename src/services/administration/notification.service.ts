import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  NotificationInfo,
  NotificationStatus,
} from '../../types/services/notification.types';

class NotificationService {
  public async fetchAll(
    userId: string,
  ): Promise<AxiosResponse<Response<NotificationInfo[]>>> {
    return await adminstrationAxios.get(`/notifications/user/${userId}`);
  }

  public async updateNotifStatus(data: {
    notificationId: number;
    status: NotificationStatus;
  }): Promise<AxiosResponse<Response<NotificationInfo>>> {
    return await adminstrationAxios.put(
      `/notifications/${data.notificationId}/mark-as/${data.status}`,
    );
  }
}

export const notificationService = new NotificationService();
