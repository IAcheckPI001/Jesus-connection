import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import MobileTopbar from './MobileTopbar';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.scss';

function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

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
        <Outlet />
      </main>
      {isDrawerOpen && (
        <MobileDrawer onClose={closeDrawer} />
      )}
    </div>
  );
}

export default DashboardLayout;
