import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input 
        id={id}
        className={`${styles.input} ${error ? styles.hasError : ''} ${className || ''}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
