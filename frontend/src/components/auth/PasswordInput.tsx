import { useState, type ChangeEvent } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import InputField from '../common/InputField';

type PasswordInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function PasswordInput({ value, onChange }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      id="password"
      name="password"
      label="MẬT KHẨU"
      type={isVisible ? 'text' : 'password'}
      value={value}
      autoComplete="current-password"
      required
      startAdornment={<KeyRound size={16} aria-hidden="true" />}
      endAdornment={(
        <button
          type="button"
          aria-label={isVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((visible) => !visible)}
          style={{ display: 'inline-flex', alignItems: 'center', color: 'inherit' }}
        >
          {isVisible
            ? <EyeOff size={17} aria-hidden="true" />
            : <Eye size={17} aria-hidden="true" />}
        </button>
      )}
      onChange={onChange}
    />
  );
}

export default PasswordInput;
