import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
