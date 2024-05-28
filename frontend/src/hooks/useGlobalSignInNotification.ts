import { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { GLOBAL_SIGNIN_NOTIFICATION_SUBSCRIPTION } from '../graphql/queries';

const useGlobalSignInNotification = () => {
  const { data: notificationData, error } = useSubscription(GLOBAL_SIGNIN_NOTIFICATION_SUBSCRIPTION);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notificationData) {
      console.log('Notification data received:', notificationData);
      setNotification(notificationData.globalSignInNotification);
    } else if (error) {
      console.error('Notification subscription error:', error);
    }
  }, [notificationData, error]);

  return notification;
};

export default useGlobalSignInNotification;
