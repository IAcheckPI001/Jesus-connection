import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  startAdornment?: ReactNode;
};

function Button({
  children,
  variant = 'primary',
  startAdornment,
  style,
  ...buttonProps
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const buttonStyle: CSSProperties = {
    minHeight: 48,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    padding: '0 18px',
    border: isPrimary ? '1px solid #244e7c' : '1px solid #d5deea',
    borderRadius: 12,
    background: isPrimary ? '#244e7c' : '#fff',
    color: isPrimary ? '#fff' : '#31577e',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
    ...style,
  };

  return (
    <button {...buttonProps} style={buttonStyle}>
      {startAdornment}
      {children}
    </button>
  );
}

export default Button;
