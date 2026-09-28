import { ChevronDown } from 'lucide-react';
import styles from './DashboardLayout.module.scss';

type UserMenuProps = {
  name: string;
  roleLabel: string;
  avatarUrl?: string;
};

function UserMenu({ name, roleLabel, avatarUrl }: UserMenuProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toLocaleUpperCase('vi');

  return (
    <button className={styles.userMenu} type="button" aria-label={`${name}, ${roleLabel}`}>
      <span className={styles.avatar} aria-hidden="true">
        {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
      </span>
      <span className={styles.userDetails}>
        <span className={styles.userName}>{name}</span>
        <span className={styles.userRole}>{roleLabel}</span>
      </span>
      <ChevronDown className={styles.userChevron} aria-hidden="true" />
    </button>
  );
}

export default UserMenu;
