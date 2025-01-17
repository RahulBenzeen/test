import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import axios from 'axios';
import { setUser } from '../../store/authSlice';

const VerifyEmail = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch(); // Uncomment if using

  // Extract token from the query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Send a request to verify the token
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/users/verify-email/${token}`)
        .then((response) => {
          const { data } = response.data;

          // Save the token and user details in localStorage
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          }));

        //   Update authentication state (if using Redux, dispatch a login action)
          dispatch(setUser(data)); // Uncomment if using Redux

          setStatus('success');
          setTimeout(() => navigate('/signin'), 2000); // Redirect to dashboard
        })
        .catch(() => {
          setStatus('error');
        });
    } else {
      setStatus('error');
    }
  }, [token, navigate, dispatch]);

  return (
    <div>
      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified successfully! Redirecting...</p>}
      {status === 'error' && <p>Error verifying email. Please try again.</p>}
    </div>
  );
};

export default VerifyEmail;
