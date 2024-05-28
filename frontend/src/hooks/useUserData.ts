import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../graphql/queries';

const useUserData = () => {
  const { data, loading, error } = useQuery(ME_QUERY);

  return { data, loading, error };
};

export default useUserData;
