import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

function RequireAuth() {
  const { status, refreshSession } = useAuthContext();
  const location = useLocation();

  if (status === 'loading') {
    return <main role="status" aria-live="polite">Đang kiểm tra phiên đăng nhập...</main>;
  }

  if (status === 'error') {
    return (
      <main role="alert">
        <p>Không thể kiểm tra phiên đăng nhập. Vui lòng thử lại.</p>
        <button type="button" onClick={() => void refreshSession()}>Thử lại</button>
      </main>
    );
  }

  if (status === 'anonymous') {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
