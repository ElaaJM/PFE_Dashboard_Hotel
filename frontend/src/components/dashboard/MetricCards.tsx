
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
  // Get the year based on the selected range
  let selectedYear = selectedRange;
  
  // Use the provided exact values from the images
  const metricValues = {
    views: {
      2022: 1907,
      2023: 1791612,
      2024: 1791612
    },
    reach: {
      2022: 800000,
      2023: 1074560,
      2024: 608213
    },
    interactions: {
      2022: 12000,
      2023: 17958,
      2024: 9438
    },
    linkClicks: {
      2022: 8000,
      2023: 11479,
      2024: 3005
    },
    follows: {
      2022: 4309,
      2023: 618,
      2024: 403
    },
    visits: {
      2022: 1712,
      2023: 85196,
      2024: 84227
    }
  };

  // Get year-over-year percentage changes
  const yoyPercentages = {
    views: {
      2022: 0,
      2023: 93849.200, 
      2024: 93849.200
    },
    reach: {
      2022: 0,
      2023: 34.320,
      2024: -43.400
    },
    interactions: {
      2022: 0,
      2023: 49.650,
      2024: -47.400
    },
    linkClicks: {
      2022: 0,
      2023: 43.490,
      2024: -73.800
    },
    follows: {
      2022: 0,
      2023: -85.700,
      2024: -34.800
    },
    visits: {
      2022: 0,
      2023: 4876.400,
      2024: -1.100
    }
  };

  // Absolute change values
  const yoyAbsolute = {
    views: {
      2022: 0,
      2023: 1789705,
      2024: 0
    },
    reach: {
      2022: 0,
      2023: 274560,
      2024: -466347
    },
    interactions: {
      2022: 0,
      2023: 5958,
      2024: -8520
    },
    linkClicks: {
      2022: 0,
      2023: 3479,
      2024: -8474
    },
    follows: {
      2022: 0,
      2023: -3691,
      2024: -215
    },
    visits: {
      2022: 0,
      2023: 83484,
      2024: -969
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <MetricCard 
        title="Total Views" 
        value={formatNumber(metricValues.views[selectedYear] || 0)}
        description={`Year ${selectedYear}`}
        yoyChange={yoyPercentages.views[selectedYear]}
        yoyAbsolute={yoyAbsolute.views[selectedYear]}
        icon={<Eye className="h-4 w-4 text-bizerta-gold" />}
        delay={0}
      />
      <MetricCard 
        title="Total Reach" 
        value={formatNumber(metricValues.reach[selectedYear] || 0)}
        description={`Year ${selectedYear}`}
        yoyChange={yoyPercentages.reach[selectedYear]}
        yoyAbsolute={yoyAbsolute.reach[selectedYear]}
        icon={<Users className="h-4 w-4 text-bizerta-gold" />}
        delay={1}
      />
      <MetricCard 
        title="Interactions" 
        value={formatNumber(metricValues.interactions[selectedYear] || 0)}
        description={`Year ${selectedYear}`}
        yoyChange={yoyPercentages.interactions[selectedYear]}
        yoyAbsolute={yoyAbsolute.interactions[selectedYear]}
        icon={<MousePointer className="h-4 w-4 text-bizerta-gold" />}
        delay={2}
      />
      <MetricCard 
        title="Link Clicks" 
        value={formatNumber(metricValues.linkClicks[selectedYear] || 0)}
        description={`Year ${selectedYear}`}
        yoyChange={yoyPercentages.linkClicks[selectedYear]}
        yoyAbsolute={yoyAbsolute.linkClicks[selectedYear]}
        icon={<Link2 className="h-4 w-4 text-bizerta-gold" />}
        delay={3}
      />
      <MetricCard 
        title="New Follows" 
        value={formatNumber(metricValues.follows[selectedYear] || 0)}
        description={`Year ${selectedYear}`}
        yoyChange={yoyPercentages.follows[selectedYear]}
        yoyAbsolute={yoyAbsolute.follows[selectedYear]}
        icon={<ArrowUpRight className="h-4 w-4 text-bizerta-gold" />}
        delay={4}
      />
      <MetricCard 
        title="Visits" 
        value={formatNumber(metricValues.visits[selectedYear] || 0)}
        description={`Year ${selectedYear}`}
        yoyChange={yoyPercentages.visits[selectedYear]}
        yoyAbsolute={yoyAbsolute.visits[selectedYear]}
        icon={<Globe className="h-4 w-4 text-bizerta-gold" />}
        delay={5}
      />
    </div>
  );
};

export default MetricCards;