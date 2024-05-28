import React from 'react';
import styles from '../../styles/Button.module.css';

interface ButtonProps {
  type: 'button' | 'submit';
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick }) => (
  <button type={type} onClick={onClick} className={styles.button}>
    {text}
  </button>
);

export default Button;
