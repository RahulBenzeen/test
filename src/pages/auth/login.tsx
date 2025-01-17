import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserThunk } from '../../store/authSlice';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import showToast from '../../utils/toast/toastUtils';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUserThunk({ email, password }));
      if (loginUserThunk.fulfilled.match(resultAction)) {
        showToast("Sign In Successful", 'success');
      } else if (loginUserThunk.rejected.match(resultAction)) {
        const errorMessage = error || "Sign In Failed. Please try again.";
        showToast(errorMessage, 'error');
      }
    } catch {
      showToast("An unexpected error occurred. Please try again.", 'error');
    }
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const { sub: googleId, email } = userInfo.data;

        const resultAction = await dispatch(loginUserThunk({
          email,
          password: googleId,
          googleId,
          tokens: tokenResponse.access_token
        }));

        if (loginUserThunk.fulfilled.match(resultAction)) {
          showToast("Google Sign In Successful", 'success');
        } else {
          throw new Error(resultAction.error.message);
        }
      } catch (error) {
        console.error('Failed to sign in with Google:', error);
        showToast("Google Sign In Failed", 'error');
      }
    },
    onError: () => {
      console.error('Google Sign-In failed');
      showToast("Google Sign In Failed", 'error');
    },
  });

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email address", 'error');
      return;
    }
    setIsForgotPasswordLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/users/forgot-password`, { email });
      if (response.data.success) {
        showToast("Password reset instructions have been sent to your email", 'success');
      } else {
        throw new Error(response.data.message || "Failed to send reset instructions");
      }
    } catch {
      showToast("Failed to send reset instructions. Please try again.", 'error');
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your details to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="link"
                  className="px-0 h-auto font-normal text-sm hover:no-underline"
                  onClick={handleForgotPassword}
                  disabled={isForgotPasswordLoading}
                >
                  {isForgotPasswordLoading ? 'Sending...' : 'Forgot password?'}
                </Button>
              </div>
            </div>
            <Button 
              className="w-full h-11 text-base font-medium" 
              type="submit" 
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 text-base font-medium"
            onClick={() => googleSignIn()}
            disabled={status === 'loading'}
          >
            <FcGoogle className="mr-3 h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col text-center sm:flex-row sm:justify-center gap-1 text-sm">
          <span className="text-muted-foreground">Don't have an account?</span>
          <Link 
            to="/register" 
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}