import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { login, logout } from '../store/userSlice';
import { useApolloClient } from '@apollo/client';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useApolloClient();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      dispatch(login(token));
    }
  }, [dispatch, token]);

  const refetchUserData = async () => {
    await client.resetStore();
  };

  const handleLogin = async (authToken: string) => {
    localStorage.setItem('authToken', authToken);
    dispatch(login(authToken));
    await refetchUserData();
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    await refetchUserData();
    navigate('/login');
  };

  return { isAuthenticated, handleLogin, handleLogout, refetchUserData };
};

export default useAuth;
