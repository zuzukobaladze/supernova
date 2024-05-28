import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { REGISTER_MUTATION } from '../graphql/queries';
import useAuth from '../hooks/useAuth';
import InputField from './common/InputField';
import Button from './common/Button';
import Notification from './common/Notification';
import styles from '../styles/Register.module.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const { handleLogin } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerMutation({ variables: { username, password } });
      await handleLogin(response.data.register.token);
    } catch (err: any) {
      if (err.graphQLErrors) {
        // Handle specific GraphQL errors
        const message = err.graphQLErrors[0]?.message || 'Invalid registration';
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
        <h2 className={styles.title}>Register</h2>
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
          <Button type="submit" text="Register" />
        </form>
        <p className={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
