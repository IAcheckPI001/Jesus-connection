
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardDiemDanhPage from './pages/DashboardDiemDanhPage';
import DashboardDoanSinhPage from './pages/DashboardThieuNhiPage';
import DashboardHoTroPage from './pages/DashboardHoTroPage';
import RequireAuth from './components/auth/RequireAuth';
import { AuthProvider } from './contexts/AuthContext';
import ThieuNhiClassPage from './pages/ThieuNhiClassPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/thieu-nhi/lop/:classId" element={<DashboardLayout initialCollapsed><ThieuNhiClassPage /></DashboardLayout>} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="thieu-nhi" replace />} />
              <Route path="diem-danh" element={<DashboardDiemDanhPage />} />
              <Route path="thieu-nhi" element={<DashboardDoanSinhPage />} />
              <Route path="ho-tro" element={<DashboardHoTroPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
