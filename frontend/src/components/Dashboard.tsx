import React, { useState } from 'react';
import Header from './dashboard/Header';
import DateRangeSelector from './dashboard/DateRangeSelector';
import DashboardHeader from './dashboard/DashboardHeader';
import DataSourceTabs from './dashboard/DataSourceTabs';
import DashboardContent from './dashboard/DashboardContent';
import MetaInsightsInfo from './dashboard/MetaInsightsInfo';
import EReputationDashboard from './dashboard/EReputationDashboard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DashboardProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
  userInfo?: {
    name: string;
    jobTitle: string;
    profileImage?: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigateToProfile, userInfo }) => {
  const {
    dashboardData,
    selectedRange,
    isLoading,
    dataSource,
    metaConnected,
    handleRangeChange,
    handleCSVImport,
    handleFolderImport,
    handleMetaDataFetch
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState<'performance' | 'ereputation'>('performance');

  return (
    <div className={`flex min-h-screen flex-col bg-bizerta-beige/30 ${isLoading ? 'opacity-70' : ''}`}>
      <Header 
        onLogout={onLogout} 
        onNavigateToProfile={onNavigateToProfile} 
        userInfo={userInfo} 
      />

      <main className="flex-1">
        <div className="dashboard-container animate-fade-in">
          <DashboardHeader 
            title={`Welcome, ${userInfo?.name || 'User'}`}
            description="Compare your digital performance metrics and analyze guest reviews"
          />

          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'performance' | 'ereputation')} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="performance">Performance Dashboard</TabsTrigger>
                <TabsTrigger value="ereputation">E-Reputation Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-grow">
                    <DateRangeSelector 
                      onRangeChange={handleRangeChange} 
                      selectedRange={selectedRange}
                    />
                  </div>

                  <DataSourceTabs 
                    onCSVImport={handleCSVImport}
                    onFolderImport={handleFolderImport}
                    onMetaDataFetch={handleMetaDataFetch}
                    isLoading={isLoading}
                    metaConnected={metaConnected}
                  />
                </div>

                {dataSource === 'meta' && <MetaInsightsInfo dataSource={dataSource} />}

                <DashboardContent 
                  dashboardData={dashboardData}
                  selectedRange={selectedRange}
                  dataSource={dataSource}
                />
              </TabsContent>

              <TabsContent value="ereputation">
                <EReputationDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
