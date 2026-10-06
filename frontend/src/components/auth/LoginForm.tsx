import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { UserRound } from 'lucide-react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import PasswordInput from './PasswordInput';

export type LoginCredentials = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onSubmit?: (credentials: LoginCredentials) => void;
};

function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.({ username: username.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 19 }}>
        <InputField
          id="username"
          name="username"
          label="SỐ ĐIỆN THOẠI"
          value={username}
          autoComplete="username"
          required
          startAdornment={<UserRound size={16} aria-hidden="true" />}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
        />
        <PasswordInput
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="login-submit"
        style={{ width: '100%', marginTop: 16, minHeight: 48, boxShadow: '0 8px 14px rgba(32, 65, 102, 0.2)' }}
      >
        Đăng nhập
      </Button>
    </form>
  );
}

export default LoginForm;
