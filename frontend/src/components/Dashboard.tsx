import React from 'react';
import Header from './dashboard/Header';
import DateRangeSelector from './dashboard/DateRangeSelector';
import DashboardHeader from './dashboard/DashboardHeader';
import DataSourceTabs from './dashboard/DataSourceTabs';
import DashboardContent from './dashboard/DashboardContent';
import MetaInsightsInfo from './dashboard/MetaInsightsInfo';
import { useDashboardData } from '@/hooks/useDashboardData';

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
            title={`Welcome`}
            description="Compare your digital performance metrics year over year"
          />
          
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
