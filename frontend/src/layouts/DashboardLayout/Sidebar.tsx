import { Link, NavLink } from 'react-router-dom';
import { ChevronLeft, Hexagon } from 'lucide-react';
import logoUrl from '../../assets/logo.svg';
import { menuItems } from './menuItems';
import NavItem from './NavItem';
import UserMenu from './UserMenu';
import styles from './DashboardLayout.module.scss';
import { useAuth } from '../../hooks/useAuth';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const name = user?.hoTen || user?.tenThanh || user?.soDienThoai || 'Tài khoản';
  const roleLabel = user?.roles.join(', ') || 'Thành viên';

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}
      aria-label="Menu quản trị"
    >
      <div className={styles.sidebarHeader}>
        {!collapsed && (
          <Link className={styles.brand} to="/dashboard/thieu-nhi" aria-label="Xứ đoàn Carlo Acutis">
            <img className={styles.brandLogo} src={logoUrl} alt="" />
            <span className={styles.brandText}>
              <span className={styles.brandEyebrow}>XỨ ĐOÀN</span>
              <span className={styles.brandName}>CARLO ACUTIS</span>
            </span>
          </Link>
        )}
        <button
          className={styles.sidebarToggle}
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <Hexagon aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}
        </button>
      </div>
      <nav className={styles.navigation} aria-label="Điều hướng dashboard">
        {collapsed
          ? menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${styles.compactNavItem} ${isActive ? styles.compactNavItemActive : ''}`
                  }
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon aria-hidden="true" />
                </NavLink>
              );
            })
          : menuItems.map((item) => <NavItem key={item.to} item={item} />)}
      </nav>
      <div className={styles.sidebarFooter}>
        <UserMenu name={name} roleLabel={roleLabel} onLogout={() => void logout()} />
      </div>
    </aside>
  );
}

export default Sidebar;
