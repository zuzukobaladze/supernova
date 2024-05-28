import { useEffect, useState, useRef } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GLOBAL_SIGNIN_COUNT_QUERY, GLOBAL_SIGNIN_COUNT_SUBSCRIPTION } from '../graphql/queries';

const useGlobalSignInCount = (threshold: number) => {
  const { data: initialData, loading: initialLoading, error: initialError, refetch } = useQuery(GLOBAL_SIGNIN_COUNT_QUERY);
  const { data: subscriptionData } = useSubscription(GLOBAL_SIGNIN_COUNT_SUBSCRIPTION);
  const [globalSignInCount, setGlobalSignInCount] = useState<number | null>(null);
  const latestGlobalSignInCount = useRef<number | null>(null);
  const [showThresholdNotification, setShowThresholdNotification] = useState<boolean>(false);

  useEffect(() => {
    if (initialData && initialData.globalSignInCount !== latestGlobalSignInCount.current) {
      setGlobalSignInCount(initialData.globalSignInCount);
      latestGlobalSignInCount.current = initialData.globalSignInCount;
      if (initialData.globalSignInCount > threshold) {
        setShowThresholdNotification(true);
      }
    }
  }, [initialData, threshold]);

  useEffect(() => {
    if (subscriptionData && subscriptionData.globalSignInCount !== latestGlobalSignInCount.current) {
      setGlobalSignInCount(subscriptionData.globalSignInCount);
      latestGlobalSignInCount.current = subscriptionData.globalSignInCount;
      if (subscriptionData.globalSignInCount > threshold) {
        setShowThresholdNotification(true);
      }
    }
  }, [subscriptionData, threshold]);

  return { globalSignInCount, initialLoading, initialError, refetch, showThresholdNotification, setShowThresholdNotification };
};

export default useGlobalSignInCount;
