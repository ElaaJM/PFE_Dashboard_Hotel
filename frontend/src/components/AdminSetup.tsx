import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from 'sonner';
import { Eye, EyeOff, Upload, UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface AdminSetupProps {
  onBack: () => void; // This prop will no longer be used for navigation
  onSignUp: (email: string, password: string, logoUrl: string) => void;
}

const AdminSetup: React.FC<AdminSetupProps> = ({ onBack, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate(); // Get the navigate function

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!logoFile) {
      toast.error('Please upload a logo');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', email.split('@')[0]);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('logo', logoFile);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register-admin', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      toast.success(data.message || 'Account created successfully');
      onSignUp(email, password, data.logoUrl || '');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bizerta-beige p-4">
      <div className="w-full max-w-md animate-fade-up">
        <Button
          variant="ghost"
          className="mb-4 text-bizerta-black hover:bg-bizerta-lightgold/20"
          onClick={() => navigate('/login')} // Use navigate to redirect
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>

        <Card className="shadow-md border-bizerta-lightgold/30 bg-white">
          <CardHeader>
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
            <CardTitle className="text-2xl text-center font-display">Create Admin Account</CardTitle>
            <CardDescription className="text-center">
              Set up your dashboard administrator credentials
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourresort.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12"
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label>Resort Logo</Label>
                <div
                  className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition-colors ${logoUrl ? 'border-bizerta-gold' : 'border-gray-300'}`}
                  onClick={triggerFileUpload}
                >
                  {logoUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={logoUrl}
                        alt="Resort Logo"
                        className="max-h-32 max-w-full mb-2"
                      />
                      <span className="text-sm text-muted-foreground">Click to replace</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-bizerta-gold mb-2" />
                      <p className="text-sm font-medium">Upload Resort Logo</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG (max 2MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-11 bg-bizerta-black hover:bg-bizerta-charcoal text-white transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
