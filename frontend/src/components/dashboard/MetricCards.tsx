
import React from 'react';
import MetricCard from './MetricCard';
import { formatNumber } from '@/lib/data-service';
import { Eye, Users, MousePointer, Link2, Globe, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  totalViews: number;
  totalReach: number;
  totalInteractions: number;
  totalLinkClicks: number;
  totalFollows: number;
  selectedRange: number;
  yoyChanges: {
    views: number;
    reach: number;
    interactions: number;
    linkClicks: number;
    follows: number;
  };
}

const MetricCards: React.FC<MetricCardsProps> = ({
  totalViews,
  totalReach,
  totalInteractions,
  totalLinkClicks,
  totalFollows,
  selectedRange,
  yoyChanges
}) => {
  return (
    <div className="dashboard-grid mb-6">
      <MetricCard 
        title="Total Views" 
        value={formatNumber(totalViews)}
        description={`Last ${selectedRange} days`}
        trend={5.2}
        yoyChange={yoyChanges.views}
        icon={<Eye className="h-4 w-4 text-bizerta-gold" />}
        delay={0}
      />
      <MetricCard 
        title="Total Reach" 
        value={formatNumber(totalReach)}
        description={`Last ${selectedRange} days`}
        trend={8.7}
        yoyChange={yoyChanges.reach}
        icon={<Users className="h-4 w-4 text-bizerta-gold" />}
        delay={1}
      />
      <MetricCard 
        title="Interactions" 
        value={formatNumber(totalInteractions)}
        description={`Last ${selectedRange} days`}
        trend={3.1}
        yoyChange={yoyChanges.interactions}
        icon={<MousePointer className="h-4 w-4 text-bizerta-gold" />}
        delay={2}
      />
      <MetricCard 
        title="Link Clicks" 
        value={formatNumber(totalLinkClicks)}
        description={`Last ${selectedRange} days`}
        trend={-2.3}
        yoyChange={yoyChanges.linkClicks}
        icon={<Link2 className="h-4 w-4 text-bizerta-gold" />}
        delay={3}
      />
      <MetricCard 
        title="New Follows" 
        value={formatNumber(totalFollows)}
        description={`Last ${selectedRange} days`}
        trend={7.4}
        yoyChange={yoyChanges.follows}
        icon={<ArrowUpRight className="h-4 w-4 text-bizerta-gold" />}
        delay={4}
      />
      <MetricCard 
        title="Audience Reach" 
        value={`${formatNumber(Math.round(totalReach * 0.7))} Unique`}
        description="Unique visitors"
        trend={4.2}
        yoyChange={yoyChanges.reach}
        icon={<Globe className="h-4 w-4 text-bizerta-gold" />}
        delay={5}
      />
    </div>
  );
};

export default MetricCards;
