// components/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from 'sonner';
import { Shield, UserPlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming you're using shadcn/ui Select component

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Use 'identifier' for email or username
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default to admin
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        identifier,
        password,
        role,
      });

      const { token, user } = response.data;

      // Store token & user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);  // <-- ADD THIS LINE

      toast.success('Welcome back!');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.error('User not found');
      } else if (err.response?.status === 400) {
        toast.error('Invalid credentials');
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bizerta-beige p-4">
      <div className="w-full max-w-md animate-fade-up">
        <Card className="shadow-md border-bizerta-lightgold/30 bg-white">
          <CardHeader className="space-y-2 pb-2">
            <div className="flex flex-col items-center mb-2">
              <img
                src="/resort_logo/5ff8de11-ae87-4ba7-bcc8-7d3e95e9d85f.png"
                alt="Bizerta Resort"
                className="h-16 mb-1"
              />
              <div className="flex items-center justify-center space-x-1 text-bizerta-gold">
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-display">
              Resort Performance Dashboard
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access your digital campaign analytics
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">{role === 'admin' ? 'Email or Username' : 'Username'}</Label>
                <Input
                  id="identifier"
                  type={role === 'admin' ? 'email' : 'text'}
                  placeholder={role === 'admin' ? 'your@email.com' : 'your-username'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-11 bg-bizerta-black hover:bg-bizerta-charcoal text-white transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-bizerta-lightgold/30 text-bizerta-black hover:bg-bizerta-lightgold/10"
                onClick={handleSignUp}
              >
                Create Admin Account
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure, encrypted connection</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
