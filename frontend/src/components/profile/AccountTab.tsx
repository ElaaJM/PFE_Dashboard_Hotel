import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// Set base API URL
const API_BASE_URL = 'http://localhost:5000';

const AccountTab = () => {
  const [initialData, setInitialData] = useState(null);
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const hasNewFile = useRef(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { username, role, email, logo } = response.data;
        setName(username || '');
        setJobTitle(role || '');
        setEmail(email || '');
        
        let fullLogoUrl = logo || '';
        // Ensure logo URL is complete with base URL if it's a relative path
        if (fullLogoUrl && !fullLogoUrl.startsWith('http') && !fullLogoUrl.startsWith('data:')) {
          fullLogoUrl = `${API_BASE_URL}${fullLogoUrl.startsWith('/') ? '' : '/'}${fullLogoUrl}`;
        }
        
        console.log('Loaded profile image URL:', fullLogoUrl);
        
        // Set both profileImage and previewImage to the actual server URL
        setProfileImage(fullLogoUrl);
        setPreviewImage(fullLogoUrl);
        
        setInitialData({ username, role, email, logo: fullLogoUrl });
      } catch (error) {
        console.error("Error fetching user info", error);
        toast.error("Failed to load user information");
      }
    };

    if (token) fetchUserData();
    else toast.error("Unauthorized: No token found");
  }, [token]);

  const hasChanges = () => {
    return (
      initialData &&
      (name !== initialData.username ||
        jobTitle !== initialData.role ||
        email !== initialData.email ||
        hasNewFile.current)
    );
  };

  const handleSaveProfile = async () => {
    if (!hasChanges()) {
      toast.info("No changes to save.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", name);
      formData.append("role", jobTitle);
      formData.append("email", email);

      // Append the new logo file if present
      if (fileInputRef.current?.files?.[0]) {
        formData.append("logo", fileInputRef.current.files[0]);
      }

      const response = await axios.put(`${API_BASE_URL}/api/auth/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Profile update response:', response.data);
      
      // Get the updated logo URL from the response
      let updatedLogo = response.data.logo || '';
      
      // Ensure the logo URL is complete with base URL if needed
      if (updatedLogo && !updatedLogo.startsWith('http') && !updatedLogo.startsWith('data:')) {
        updatedLogo = `${API_BASE_URL}${updatedLogo.startsWith('/') ? '' : '/'}${updatedLogo}`;
      }
      
      console.log('Using updated logo URL:', updatedLogo);
      
      // Force browser to reload the image by adding a cache-busting parameter
      const cacheBuster = `?v=${new Date().getTime()}`;
      const logoWithCacheBuster = updatedLogo ? `${updatedLogo}${cacheBuster}` : '';
      
      // Update both the previewImage and profileImage with the actual server URL
      setProfileImage(logoWithCacheBuster);
      setPreviewImage(logoWithCacheBuster);
      
      // Reset the file input and flag
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      hasNewFile.current = false;

      // Update initialData
      setInitialData({
        username: name,
        role: jobTitle,
        email,
        logo: logoWithCacheBuster,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile", error);
      const message = error?.response?.data?.message || "Failed to save profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          // Only update the preview image, not the actual profile image yet
          setPreviewImage(event.target.result);
          hasNewFile.current = true;
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your account details and public profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar
            className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleProfilePictureClick}
          >
            {/* Use previewImage for display during the session */}
            {previewImage ? (
              <AvatarImage 
                src={previewImage} 
                alt={name} 
                onError={(e) => {
                  console.error('Avatar image failed to load:', e);
                  // If image fails to load, clear src to show fallback
                  e.currentTarget.src = '';
                }}
              />
            ) : (
              <AvatarImage src="" alt={name} />
            )}
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
          <Button variant="outline" size="sm" onClick={handleProfilePictureClick}>
            Change Profile Picture
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Role</Label>
            <Input
              id="title"
              disabled
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
        </div>

        <Separator />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSaveProfile} disabled={isSaving || !hasChanges()}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        
      </CardFooter>
    </Card>
  );
};

export default AccountTab;