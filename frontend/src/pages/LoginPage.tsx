import { ArrowRight, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.scss';

function LoginPage() {
  const { login } = useAuth();

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard} aria-labelledby="login-title">
        <div className={styles.loginBrand}>
          <img className={styles.loginLogo} src="/logo.svg" alt="Logo Xứ đoàn Carlo Acutis" />
          <h1 className={styles.loginTitle} id="login-title">XỨ ĐOÀN CARLO ACUTIS</h1>
          <h2 className={styles.loginDescription} id="login-description">Đăng nhập hệ thống xứ đoàn</h2>
        </div>

        <LoginForm onSubmit={login} />

        <div className={styles.loginRegister}>
          <Link to="/register">
            Đăng ký sử dụng <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.loginHome}>
          <Link to="/">
            <House size={16} aria-hidden="true" />
            <span>Quay lại trang chính</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
