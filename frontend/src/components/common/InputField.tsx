import type { ChangeEvent, ReactNode } from 'react';
import styles from './InputField.module.scss';

type InputFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  id,
  label,
  name,
  type = 'text',
  value,
  placeholder,
  autoComplete,
  required = false,
  startAdornment,
  endAdornment,
  onChange,
}: InputFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.inputWrap}>
        {startAdornment && <span className={styles.startAdornment}>{startAdornment}</span>}
        <input
          className={styles.input}
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          onChange={onChange}
        />
        {endAdornment && <span className={styles.endAdornment}>{endAdornment}</span>}
      </div>
    </div>
  );
}

export default InputField;
