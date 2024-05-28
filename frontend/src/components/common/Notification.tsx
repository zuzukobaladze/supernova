import React, { useEffect } from 'react';
import styles from '../../styles/Notification.module.css';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      {message}
      <div className={styles.timerLine} style={{ animationDuration: `${duration}ms` }}></div>
    </div>
  );
};

export default Notification;
