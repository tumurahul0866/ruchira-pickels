import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return null;
  }

  if (adminOnly) {
    return isAdmin ? children : <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
