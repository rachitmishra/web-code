import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  success?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  success = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${success ? styles.success : ''} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading || success}
      {...props}
    >
      {loading ? 'Loading...' : success ? 'Added!' : children}
    </button>
  );
};

export default Button;
