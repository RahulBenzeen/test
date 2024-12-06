import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserThunk } from '../../store/authSlice';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "../../components/ui/card";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import showToast from '../../utils/toast/toastUtils';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (err) {
      showToast("Sign In Failed", 'error');
    }
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const { sub: id, email, name } = userInfo.data;

        const resultAction = await dispatch(loginUserThunk({ email, password: id }));
        if (loginUserThunk.fulfilled.match(resultAction)) {
          showToast("Google Sign In Successful",'success');
        } else {
          throw new Error(resultAction.error.message);
        }
      } catch (error) {
        console.error('Failed to sign in with Google:', error);
        showToast( "Google Sign In Failed",'error');
      }
    },
    onError: () => {
      console.error('Google Sign-In failed');
      showToast( "Google Sign In Failed",'error' );
    },
  });

  if (isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your details to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => googleSignIn()}
            disabled={status === 'loading'}
          >
            <FcGoogle className="mr-2 h-4 w-4" /> Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}