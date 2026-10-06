import type { ReactNode } from 'react';
import styles from './StatsBar.module.scss';

export type StatsBarItem = {
  key: string;
  icon: ReactNode;
  value: number | null;
  label: string;
  eyebrow?: string;
};

type StatsBarProps = {
  items: StatsBarItem[];
  isLoading?: boolean;
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

function StatsBar({ items, isLoading = false }: StatsBarProps) {
  return (
    <ul className={styles.statsBar} aria-label="Thống kê" aria-busy={isLoading}>
      {items.map((item) => (
        <li className={styles.statItem} key={item.key}>
          <span className={styles.iconCircle} aria-hidden="true">{item.icon}</span>
          <span className={styles.statContent}>
            {item.eyebrow && <span className={styles.eyebrow}>{item.eyebrow}</span>}
            {isLoading ? (
              <span className={styles.skeletonValue} aria-hidden="true" />
            ) : (
              <span className={styles.value}>
                {item.value === null ? '—' : numberFormatter.format(item.value)}
              </span>
            )}
            <span className={styles.label}>{item.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default StatsBar;
