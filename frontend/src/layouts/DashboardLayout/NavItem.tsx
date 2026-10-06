import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { MenuItem as MenuItemType } from './menuItems';
import styles from './DashboardLayout.module.scss';

type NavItemProps = {
  item: MenuItemType;
  onNavigate?: () => void;
};

function NavItem({ item, onNavigate }: NavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
      }
    >
      <Icon className={styles.navIcon} aria-hidden="true" />
      <span className={styles.navLabel}>{item.label}</span>
      <ChevronRight className={styles.navChevron} aria-hidden="true" />
    </NavLink>
  );
}

export default NavItem;
