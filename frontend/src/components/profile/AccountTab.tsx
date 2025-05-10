
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface AccountTabProps {
  userInfo?: {
    name: string;
    jobTitle: string;
    profileImage?: string;
  };
}

const AccountTab: React.FC<AccountTabProps> = ({ userInfo = { name: "James Wilson", jobTitle: "Marketing Director" } }) => {
  const [name, setName] = useState(userInfo.name);
  const [jobTitle, setJobTitle] = useState(userInfo.jobTitle);
  const [profileImage, setProfileImage] = useState(userInfo.profileImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    // Here you would save the profile data to your storage/backend
    toast.success("Profile updated successfully");
  };
  
  const copyApiKey = () => {
    navigator.clipboard.writeText("bizerta-api-key-12345-demo");
    toast.success("API Key copied to clipboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your account details and public profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity" onClick={handleProfilePictureClick}>
            <AvatarImage src={profileImage || ""} />
            <AvatarFallback className="relative">
              {getInitials(name)}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleProfilePictureClick}
          >
            Change Profile Picture
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="james@bizertaresort.com" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input 
              id="title" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" defaultValue="Marketing" />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea 
            id="bio" 
            className="w-full p-3 rounded-md border border-input bg-background text-sm"
            rows={4}
            defaultValue="Marketing professional with 10+ years of experience in the luxury hospitality industry."
          />
        </div>
        

      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveProfile}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountTab;
