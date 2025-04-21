import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks'; // Import your custom selector hook
import { useEffect, useState } from 'react';
import showToast from '../toast/toastUtils';

const AdminRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true); // State to track if auth data is loaded

  useEffect(() => {
    // Once auth data is loaded, set loading to false
    if (isAuthenticated !== undefined) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Show toast if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      showToast('Page Not Found: 404', 'warning');
    }
  }, [isAuthenticated, loading]); // Show toast only when authentication status changes and after loading is complete

  // If the data is still loading, show a loading screen or do nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  // If authenticated but not an admin, redirect to a forbidden page
  if (user?.role !== 'admin') {
    return <Navigate to="/forbidden" />;
  }

  return <Outlet />; // If the user is authenticated and is an admin, render the child routes
};

export default AdminRoute;
