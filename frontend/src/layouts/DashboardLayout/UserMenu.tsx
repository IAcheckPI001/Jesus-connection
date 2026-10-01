import { LogOut } from 'lucide-react';
import styles from './DashboardLayout.module.scss';

type UserMenuProps = {
  name: string;
  roleLabel: string;
  avatarUrl?: string;
  onLogout: () => void;
};

function UserMenu({ name, roleLabel, avatarUrl, onLogout }: UserMenuProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toLocaleUpperCase('vi');

  return (
    <div className={styles.userMenu}>
      <div className={styles.userIdentity}>
        <span className={styles.avatar} aria-hidden="true">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
        </span>
        <span className={styles.userDetails}>
          <span className={styles.userName}>{name}</span>
          <span className={styles.userRole}>{roleLabel}</span>
        </span>
      </div>
      <button className={styles.logoutButton} type="button" onClick={onLogout}>
        <LogOut size={16} aria-hidden="true" />
        <span className={styles.logoutLabel}>Đăng xuất</span>
      </button>
    </div>
  );
}

export default UserMenu;
