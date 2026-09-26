

import { Link } from 'react-router-dom';
import styles from "./Header.module.scss";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink} aria-label="Trang chủ">
            <img src="/logo.svg" alt="Logo xứ đoàn Carlo Acutis" className={styles.logo} />
          </Link>
          <div className={styles.brandText}>
            <Link to="/" className={styles.brandName}>XỨ ĐOÀN CARLO ACUTIS</Link>
            <span className={styles.brandSubtitle}>Giáo họ Giuse Vĩnh Lộc B</span>
          </div>
        </div>
        <nav className={styles.nav}>
          <Link to="/">Trang chủ</Link>
          <Link to="/thong-tin">Thông tin</Link>
          <Link to="/tin-tuc">Tin tức</Link>
          <Link to="/lien-he">Liên hệ</Link>
          <Link to="/dang-nhap" className={styles.login}>Đăng nhập</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
