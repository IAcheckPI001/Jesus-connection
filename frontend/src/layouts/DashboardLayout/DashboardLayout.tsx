import { useCallback, useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import MobileTopbar from './MobileTopbar';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.scss';
import { useEffect } from 'react';

function DashboardLayout({ initialCollapsed = false, children }: { initialCollapsed?: boolean; children?: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  useEffect(() => { setIsCollapsed(initialCollapsed); }, [initialCollapsed]);

  return (
    <div className={`dashboard-scope ${styles.scope} ${isCollapsed ? styles.collapsed : ''}`}>
      <MobileTopbar
        drawerOpen={isDrawerOpen}
        onMenuClick={() => setIsDrawerOpen(true)}
      />
      <Sidebar
        collapsed={isCollapsed}
        onToggle={() => setIsCollapsed((current) => !current)}
      />
      <main className={styles.content}>
        {children ?? <Outlet />}
      </main>
      {isDrawerOpen && (
        <MobileDrawer onClose={closeDrawer} />
      )}
    </div>
  );
}

export default DashboardLayout;
