import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Users } from "lucide-react";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'admin' | 'analyst';
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  userRole = 'admin', 
}) => {
  const [userInfo, setUserInfo] = useState<{
    username?: string;
    role?: string;
    logo?: string;
  }>({});

  // Get initials fallback
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const username = userInfo?.username || "Unknown User";
  const role = userInfo?.role || "No Role";
  const logo = userInfo?.logo || "";

  return (
    <Card className="col-span-12 md:col-span-4 lg:col-span-3">
      <CardHeader>
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {logo ? (
              <AvatarImage 
                src={`http://localhost:5000${logo}`} 
                alt={username}
                onError={(e) => {
                  console.error('Avatar image failed to load:', e);
                  e.currentTarget.src = '';
                }}
              />
            ) : (
              <AvatarImage src="" alt={username} />
            )}
            <AvatarFallback>
              {username ? getInitials(username) : "UN"}
            </AvatarFallback>
          </Avatar>
          <CardTitle>{username}</CardTitle>
          <CardDescription className="mt-1 px-2 py-0.5 bg-bizerta-gold/10 text-bizerta-gold rounded-full text-xs uppercase">
            {role}
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
            <TabsTrigger value="security" className="justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
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
