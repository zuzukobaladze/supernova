import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData';
import useGlobalSignInCount from '../hooks/useGlobalSignInCount';
import useGlobalSignInNotification from '../hooks/useGlobalSignInNotification';
import Notification from './common/Notification';
import styles from '../styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  const threshold = 5; // Define your threshold here
  const { data, loading, error } = useUserData();
  const { handleLogout } = useAuth();
  const { globalSignInCount, initialLoading, initialError, showThresholdNotification, setShowThresholdNotification } = useGlobalSignInCount(threshold);
  const notification = useGlobalSignInNotification();
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    if (notification) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [notification]);

  useEffect(() => {
    if (showThresholdNotification) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setShowThresholdNotification(false);
      }, 5000);
    }
  }, [showThresholdNotification, setShowThresholdNotification]);

  if (loading || initialLoading) return <p>Loading...</p>;
  if (error || initialError) return <p>Error: {error?.message || initialError?.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.infoContainer}>
          <p className={styles.info}>Username: {data.me.username}</p>
          <p className={styles.info}>Sign-in Count: {data.me.signInCount}</p>
          <p className={styles.info}>Global Sign-in Count: {globalSignInCount}</p>
        </div>
        <button className={styles.button} onClick={handleLogout}>Logout</button>
      </div>
      {showNotification && <Notification message={`Global sign-in count has exceeded ${threshold}!`} type="success" />}
    </div>
  );
};

export default Dashboard;
