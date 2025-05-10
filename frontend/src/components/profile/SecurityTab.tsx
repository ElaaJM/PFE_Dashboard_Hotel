
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SecurityTabProps {
  onPasswordChange?: (oldPassword: string, newPassword: string) => boolean;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const handlePasswordChange = () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    // In a real implementation, this would call an API to change the password
    if (onPasswordChange) {
      const success = onPasswordChange(currentPassword, newPassword);
      if (success) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Current password is incorrect");
      }
    } else {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleToggleTwoFactor = () => {
    // In a real implementation, this would set up 2FA
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(twoFactorEnabled 
      ? "Two-factor authentication disabled" 
      : "Two-factor authentication enabled");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Change Password</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input 
                  id="currentPassword" 
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div 
                className={`h-6 w-12 rounded-full p-1 transition-colors cursor-pointer ${twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`} 
                onClick={handleToggleTwoFactor} 
                role="checkbox" 
                aria-checked={twoFactorEnabled}
              >
                <div className={`h-4 w-4 rounded-full bg-white transform transition-transform ${twoFactorEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
              <span>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">Chrome on macOS • Miami, US</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active now</span>
            </div>
            
            <Button variant="outline" className="w-full">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Sign out of all other sessions
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            Danger Zone
          </h3>
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-sm mb-3">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
