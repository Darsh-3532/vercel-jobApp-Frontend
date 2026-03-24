import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If Admin tries to access User route or vice-versa
    if (user?.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/jobs" replace />;
  }

  return <Outlet />;
};
