import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserThunk, setUser,loginUserThunk  } from '../../store/authSlice';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { useAppDispatch } from '../../store/hooks';
import showToast from '../../utils/toast/toastUtils';
export default function Register() {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const registerResult = await dispatch(
        registerUserThunk({ name, email, password })
      );
  
      if (registerUserThunk.fulfilled.match(registerResult)) {
        const loginResult = await dispatch(loginUserThunk({ email, password }));
        if (loginUserThunk.fulfilled.match(loginResult)) {
          navigate('/');
          showToast('Registration successful', 'success');
        } else {
          throw new Error('Login after registration failed');
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const { sub: id, email, name } = userInfo.data;

        const loginResult = await dispatch(loginUserThunk({ email, password: id }));
        if (loginUserThunk.fulfilled.match(loginResult)) {
          navigate('/');
          showToast('Google Sign-In successful', 'success');
        } else {
          throw new Error('Google Sign-In failed');
        }
      } catch (error) {
        console.error('Failed to sign in with Google:', error);
        showToast('Google Sign-In failed', 'error');
      }
    },
    onError: () => {
      console.error('Google Sign-In failed');
      showToast('Google Sign-In failed', 'error');
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter your username"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Sign up'}
            </Button>
          </form>
          {error && <div className="text-red-500 text-center mt-2">{error}</div>}
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
            onClick={() => googleLogin()}
          >
            <FcGoogle className="mr-2 h-4 w-4" /> Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link to={"/signin"} className="text-primary hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
