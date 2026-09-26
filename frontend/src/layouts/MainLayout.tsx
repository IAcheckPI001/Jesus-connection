

import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer/Footer';

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout__body">
        <Sidebar />
        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;