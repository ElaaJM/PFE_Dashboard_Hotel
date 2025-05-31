
import React from 'react';
import EngagementChart from './EngagementChart';
import GeographicCard from './GeographicCard';
import MetricCards from './MetricCards';
import MetaInsightsInfo from './MetaInsightsInfo';
import { DashboardData } from '@/lib/data-service';
import AudienceCharts from './charts/AudienceCharts';
import ContentTypeChart from './charts/ContentTypeChart';
import FollowersChart from './charts/FollowersChart';
import VisitsChart from './charts/VisitsChart';

interface DashboardContentProps {
  dashboardData: DashboardData;
  selectedRange: number;
  dataSource: 'mock' | 'imported' | 'meta';
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  dashboardData,
  selectedRange,
  dataSource
}) => {
  // Convert selectedRange to a year if it's a large number (legacy code support)
  const selectedYear = selectedRange > 2000 ? selectedRange : 2024;
  
  return (
    <>

      
      <MetricCards 
        totalViews={dashboardData.totalViews}
        totalReach={dashboardData.totalReach}
        totalInteractions={dashboardData.totalInteractions}
        totalLinkClicks={dashboardData.totalLinkClicks}
        totalFollows={dashboardData.totalFollows}
        selectedRange={selectedYear}
        yoyChanges={dashboardData.yoyChanges}
      />
      
      <div className="mb-6">
        <EngagementChart 
          data={dashboardData.dailyStats}
          previousYearData={dashboardData.previousYearStats}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VisitsChart />
        <FollowersChart />
      </div>
      
      <div className="mb-6">
        <ContentTypeChart />
      </div>
      
      <div className="mb-6">
        <AudienceCharts />
      </div>
      
      <div className="mb-6">
        <GeographicCard 
          title="Top Countries" 
          data={dashboardData.topCountries} 
        />
      </div>
      
      {dataSource === 'meta' && <MetaInsightsInfo dataSource={dataSource} />}
    </>
  );
};

export default DashboardContent;