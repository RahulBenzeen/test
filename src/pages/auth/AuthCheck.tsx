import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { checkAuthToken } from '../../store/authSlice';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);


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