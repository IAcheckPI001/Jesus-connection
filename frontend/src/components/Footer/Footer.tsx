import { Link } from 'react-router-dom';
import styles from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerMain}>
          <section className={styles.about} aria-label="Giới thiệu xứ đoàn">
            <img className={styles.footerLogo} src="/logo.svg" alt="Logo xứ đoàn Carlo Acutis" />
            <Link to="/" className={styles.brandName}>XỨ ĐOÀN CARLO ACUTIS</Link>
            <p className={styles.parish}>Giáo họ Giuse Vĩnh Lộc B</p>
            <p className={styles.description}>
              Cổng thông tin hoạt động, sinh hoạt và thông báo của Xứ đoàn.
            </p>
          </section>

          <nav className={styles.footerColumn} aria-label="Thông tin">
            <h2 className={styles.heading}>THÔNG TIN</h2>
            <Link to="/">Trang chủ</Link>
            <Link to="/about">Thông tin</Link>
            <Link to="/news">Tin tức</Link>
            <Link to="/contact">Liên hệ</Link>
          </nav>

          <section className={styles.footerColumn}>
            <h2 className={styles.heading}>LIÊN HỆ</h2>
            <div className={styles.footerItems}>
              <img className={styles.footerIcons} src="/icon/map.svg" alt="map icon" />
              <p>Giáo họ Giuse Vĩnh Lộc B</p>
            </div>
            <div className={styles.footerItems}>
              <img className={styles.footerIcons} src="/icon/fanpage.svg" alt="facebook icon" />
              <p>Fanpage: <a href="https://facebook.com/GDGius" target="_blank" rel="noreferrer">facebook.com/GDGius</a></p>
            </div>
            <div className={styles.footerItems}>
              <p>Điện thoại: <a href="tel:0983171252">098 317 12 52</a></p>
            </div>
          </section>

        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Xứ đoàn thành tâm • Giáo họ Giuse Vĩnh Lộc B</p>
          <div className={styles.bottomLinks}>
            <a href="https://facebook.com/GDGius" target="_blank" rel="noreferrer">Facebook</a>
            <span aria-hidden="true">•</span>
            <Link to="/">Website</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
