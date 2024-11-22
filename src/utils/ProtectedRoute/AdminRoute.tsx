import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks'; // Import your custom selector hook
import showToast from '../toast/toastUtils';
const AdminRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    showToast('Page Not Found: 404', 'warning')
    return <Navigate to="/signin" />;
  }

  // If authenticated but not an admin, redirect to a forbidden page
  if (user?.role !== 'admin') {
    return <Navigate to="/forbidden" />;
  }

  return <Outlet />; // If the user is authenticated and is an admin, render the child routes
};

export default AdminRoute;
