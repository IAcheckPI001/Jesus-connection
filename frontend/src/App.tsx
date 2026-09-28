

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardDiemDanhPage from './pages/DashboardDiemDanhPage';
import DashboardThieuNhiPage from './pages/DashboardThieuNhiPage';
import DashboardHoTroPage from './pages/DashboardHoTroPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="thieu-nhi" replace />} />
          <Route path="diem-danh" element={<DashboardDiemDanhPage />} />
          <Route path="thieu-nhi" element={<DashboardThieuNhiPage />} />
          <Route path="ho-tro" element={<DashboardHoTroPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
