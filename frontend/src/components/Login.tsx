import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/queries';
import useAuth from '../hooks/useAuth';
import InputField from './common/InputField';
import Button from './common/Button';
import Notification from './common/Notification';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const { handleLogin } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginMutation({ variables: { username, password } });
      await handleLogin(response.data.login.token);
    } catch (err: any) {
      if (err.graphQLErrors) {
        // Handle specific GraphQL errors
        const message = err.graphQLErrors[0]?.message || 'Invalid login';
        setErrorMessage(message);
      } else {
        // Handle network errors
        setErrorMessage('Network error, please try again');
      }
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  return (
    <div className={styles.container}>
      {showError && <Notification message={errorMessage} type="error" onClose={() => setShowError(false)} />}
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" text="Login" />
        </form>
        <p className={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
