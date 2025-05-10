import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook
import Header from './dashboard/Header';
import ProfileSidebar from './profile/ProfileSidebar';
import AccountTab from './profile/AccountTab';
import DataImportTab from './profile/DataImportTab';
import MetaIntegrationTab from './profile/MetaIntegrationTab';
import SecurityTab from './profile/SecurityTab';
import UserManagementTab from './profile/UserManagementTab';

interface ProfileProps {
  onLogout: () => void;
  userRole?: 'admin' | 'analyst';
  userInfo: {
    name: string;
    jobTitle: string;
    profileImage?: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ onLogout, userRole = 'admin', userInfo }) => {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate(); // Using useNavigate hook for navigation

  // Function to handle back button click
  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Change '/dashboard' to your dashboard route
  };

  return (
    <div className="flex min-h-screen flex-col bg-bizerta-beige/30">
      <Header onLogout={onLogout} onNavigateToProfile={() => {}} userInfo={userInfo} />
      
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={handleBackToDashboard} // Binding the back to dashboard action
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-display font-semibold tracking-wide">Account Settings</h1>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            <ProfileSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              userRole={userRole}
              userInfo={userInfo}
            />
            
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsContent value="account">
                  <AccountTab userInfo={userInfo} />
                </TabsContent>
                
                <TabsContent value="data-import">
                  <DataImportTab />
                </TabsContent>
                
                <TabsContent value="meta-connect">
                  <MetaIntegrationTab />
                </TabsContent>
                
                <TabsContent value="security">
                  <SecurityTab />
                </TabsContent>
                
                {userRole === 'admin' && (
                  <TabsContent value="user-management">
                    <UserManagementTab />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
