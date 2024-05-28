import React from 'react';
import styles from '../../styles/InputField.module.css';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => (
  <div className={styles.inputField}>
    <label className={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={styles.input}
    />
  </div>
);

export default InputField;
