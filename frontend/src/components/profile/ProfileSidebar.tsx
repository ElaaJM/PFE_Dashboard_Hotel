import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FolderUp, Facebook, Lock, Users } from "lucide-react";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'admin' | 'analyst';
  userInfo: {
    name: string;
    jobTitle: string;
    profileImage?: string;
  };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  userRole = 'admin', 
  userInfo 
}) => {
  // Fallback function to get initials if no name is provided
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // Fallback values for userInfo
  const name = userInfo?.name || "Unknown Name";
  const jobTitle = userInfo?.jobTitle || "No Job Title";
  const profileImage = userInfo?.profileImage || "/default-profile-image.png";

  return (
    <Card className="col-span-12 md:col-span-4 lg:col-span-3">
      <CardHeader>
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{jobTitle}</CardDescription>
          <CardDescription className="mt-1 px-2 py-0.5 bg-bizerta-gold/10 text-bizerta-gold rounded-full text-xs uppercase">
            {userRole}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" orientation="vertical">
          <TabsList className="flex flex-col h-auto items-stretch w-full">
            <TabsTrigger value="account" className="justify-start">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="data-import" className="justify-start">
              <FolderUp className="h-4 w-4 mr-2" />
              Data Import
            </TabsTrigger>
            <TabsTrigger value="meta-connect" className="justify-start">
              <Facebook className="h-4 w-4 mr-2" />
              Meta Integration
            </TabsTrigger>
            <TabsTrigger value="security" className="justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>

            {/* Only render the User Management tab if the user is an admin */}
            {userRole === 'admin' && (
              <TabsTrigger value="user-management" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
