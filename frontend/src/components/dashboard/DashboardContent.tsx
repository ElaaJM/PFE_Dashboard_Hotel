
import React from 'react';
import EngagementChart from './EngagementChart';
import DemographicsCard from './DemographicsCard';
import GeographicCard from './GeographicCard';
import ContentFormatCard from './ContentFormatCard';
import MetricCards from './MetricCards';
import MetaInsightsInfo from './MetaInsightsInfo';
import { DashboardData } from '@/lib/data-service';

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
  return (
    <>
      <MetricCards 
        totalViews={dashboardData.totalViews}
        totalReach={dashboardData.totalReach}
        totalInteractions={dashboardData.totalInteractions}
        totalLinkClicks={dashboardData.totalLinkClicks}
        totalFollows={dashboardData.totalFollows}
        selectedRange={selectedRange}
        yoyChanges={dashboardData.yoyChanges}
      />
      
      <div className="mb-6">
        <EngagementChart 
          data={dashboardData.dailyStats}
          previousYearData={dashboardData.previousYearStats}
        />
      </div>
      
      <div className="mb-6">
        <DemographicsCard 
          audienceGender={dashboardData.audienceGender}
          audienceAge={dashboardData.audienceAge}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <GeographicCard 
          title="Top Countries" 
          data={dashboardData.topCountries} 
        />
        <GeographicCard 
          title="Top Cities" 
          data={dashboardData.topCities} 
        />
      </div>
      
      <div className="mb-6">
        <ContentFormatCard data={dashboardData.contentFormats} />
      </div>
      
      {dataSource === 'meta' && <MetaInsightsInfo dataSource={dataSource} />}
    </>
  );
};

export default DashboardContent;
