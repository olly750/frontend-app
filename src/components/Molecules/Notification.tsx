import moment from 'moment';
import React from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../hooks/useAuthenticator';
import { queryClient } from '../../plugins/react-query';
import { notificationStore } from '../../store/administration/notification.store';
import {
  NotificationInfo,
  NotificationStatus,
  NotificationType,
} from '../../types/services/notification.types';
import { linkConstructor } from '../../utils/linkConstructor';
import Heading from '../Atoms/Text/Heading';

type NotificationProps = {
  notifications: NotificationInfo[];
};

export default function Notification({ notifications }: NotificationProps) {
  const history = useHistory();
  const { mutate } = notificationStore.updateNotificationStatus();
  const { user } = useAuthenticator();

  function navigator(
    notificationId: number,
    notificationType: string,
    beneficiaryId: string,
  ) {
    //@ts-ignore
    const url = linkConstructor(NotificationType[notificationType], beneficiaryId);

    if (
      notifications.find((not) => not.id === notificationId)?.notifaction_status ===
      NotificationStatus.UNREAD
    ) {
      mutate(
        { notificationId: notificationId, status: NotificationStatus.READ },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['notifications/user', user?.id.toString()]);
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        },
      );
    }

    if (url) history.push(url, beneficiaryId);
  }
  return (
    <div className="flex flex-col pb-6 pr-4 overflow-y-auto h-96">
      <Heading fontWeight="semibold" color="txt-primary">
        Notifications
      </Heading>

      {notifications && notifications?.length > 0 ? (
        notifications?.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <div
              onKeyDown={() => {}}
              role="button"
              tabIndex={index}
              onClick={() =>
                navigator(
                  parseInt(notification.id as string),
                  notification.notification_type,
                  notification.notification_entity_beneficiary_uuid,
                )
              }>
              <div className="pt-7 pb-3">
                <Heading fontSize="base" fontWeight="semibold" color="txt-secondary">
                  {moment(notification.created_on).format('MM/DD/YYYY')}
                </Heading>
              </div>
              <div className="flex justify-between items-center gap-6">
                <div className="flex flex-col gap-1 pb-4">
                  <Heading color="txt-primary" fontSize="base" fontWeight="semibold">
                    {notification.title}
                  </Heading>

                  <Heading fontSize="sm" color="txt-secondary">
                    {notification.message}
                  </Heading>
                </div>
                <div>
                  {notification.notifaction_status === NotificationStatus.UNREAD ? (
                    <span className="h-2 w-2 block bg-primary-400 rounded-full"></span>
                  ) : (
                    <span className="h-2 w-2 mblock bg-main rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
            <hr className="bg-tertiary" style={{ height: '2px' }} />
          </React.Fragment>
        ))
      ) : (
        <div className="flex flex-col gap-1 pb-4 pt-4">
          <Heading fontSize="sm" color="txt-secondary">
            No new notifications
          </Heading>
        </div>
      )}
    </div>
  );
}
