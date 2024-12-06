import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkAuthToken } from '../../store/authSlice';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthToken());
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch]);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}