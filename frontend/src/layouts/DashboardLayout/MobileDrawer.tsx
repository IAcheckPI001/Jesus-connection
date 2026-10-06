import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoUrl from '../../assets/logo.svg';
import { menuItems } from './menuItems';
import NavItem from './NavItem';
import UserMenu from './UserMenu';
import styles from './DashboardLayout.module.scss';
import { useAuth } from '../../hooks/useAuth';

type MobileDrawerProps = {
  onClose: () => void;
};

function MobileDrawer({ onClose }: MobileDrawerProps) {
  const { user, logout } = useAuth();
  const drawerRef = useRef<HTMLElement>(null);
  const name = user?.hoTen || user?.tenThanh || user?.soDienThoai || 'Tài khoản';
  const roleLabel = user?.roles.join(', ') || 'Thành viên';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector<HTMLButtonElement>('button')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.getElementById('dashboard-menu-trigger')?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.drawerOverlay} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside
        ref={drawerRef}
        id="dashboard-mobile-drawer"
        className={styles.mobileDrawer}
        role="dialog"
        aria-modal="true"
        aria-label="Menu quản trị"
      >
        <div className={styles.drawerHeader}>
          <Link className={styles.brand} to="/dashboard/thieu-nhi" aria-label="Xứ đoàn Carlo Acutis">
            <img className={styles.brandLogo} src={logoUrl} alt="" />
            <span className={styles.brandText}>
              <span className={styles.brandEyebrow}>XỨ ĐOÀN</span>
              <span className={styles.brandName}>CARLO ACUTIS</span>
            </span>
          </Link>
          <button className={styles.drawerClose} type="button" onClick={onClose} aria-label="Đóng menu">
            <X aria-hidden="true" />
          </button>
        </div>
        <nav className={styles.navigation} aria-label="Điều hướng dashboard">
          {menuItems.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
        </nav>
        <div className={styles.drawerFooter}>
          <UserMenu name={name} roleLabel={roleLabel} onLogout={() => void logout()} />
        </div>
      </aside>
    </div>
  );
}

export default MobileDrawer;
