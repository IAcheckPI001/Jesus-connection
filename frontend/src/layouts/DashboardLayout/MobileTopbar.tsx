import { Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoUrl from '../../assets/logo.svg';
import styles from './DashboardLayout.module.scss';

type MobileTopbarProps = {
  drawerOpen: boolean;
  onMenuClick: () => void;
};

function MobileTopbar({ drawerOpen, onMenuClick }: MobileTopbarProps) {
  return (
    <header className={styles.mobileTopbar}>
      <button
        className={styles.mobileIconButton}
        id="dashboard-menu-trigger"
        type="button"
        onClick={onMenuClick}
        aria-label="Mở menu"
        aria-expanded={drawerOpen}
        aria-controls="dashboard-mobile-drawer"
      >
        <Menu aria-hidden="true" />
      </button>
      <Link className={styles.mobileBrand} to="/dashboard/thieu-nhi" aria-label="Xứ đoàn Carlo Acutis">
        <img src={logoUrl} alt="" />
        <span>
          <span className={styles.brandEyebrow}>XỨ ĐOÀN</span>
          <span className={styles.brandName}>CARLO ACUTIS</span>
        </span>
      </Link>
      <button className={styles.mobileIconButton} type="button" aria-label="Tìm kiếm">
        <Search aria-hidden="true" />
      </button>
    </header>
  );
}

export default MobileTopbar;
