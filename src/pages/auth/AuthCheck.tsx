import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { checkAuthToken } from '../../store/authSlice';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthToken());
  }, [dispatch]);

  return <>{children}</>;
}