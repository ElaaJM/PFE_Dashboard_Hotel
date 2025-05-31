import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyStats } from '@/lib/data-service';

interface EngagementChartProps {
  data: DailyStats[];
  previousYearData?: DailyStats[];
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data, previousYearData }) => {
  // Aggregate daily stats by year, summing metrics
  function aggregateByYear(data: DailyStats[]) {
    const yearlyMap: Record<string, { views: number; interactions: number; linkClicks: number }> = {};

    data.forEach(({ date, views, interactions, linkClicks }) => {
      const year = new Date(date).getFullYear().toString();
      if (!yearlyMap[year]) {
        yearlyMap[year] = { views: 0, interactions: 0, linkClicks: 0 };
      }
      yearlyMap[year].views += views;
      yearlyMap[year].interactions += interactions;
      yearlyMap[year].linkClicks += linkClicks;
    });

    // Convert to array, keep last 3 years sorted chronologically (oldest first)
    return Object.entries(yearlyMap)
      .map(([year, metrics]) => ({ year, ...metrics }))
      .sort((a, b) => Number(a.year) - Number(b.year))
      .slice(-3);
  }

  const currentYearDataByYear = aggregateByYear(data);
  const previousYearDataByYear = previousYearData ? aggregateByYear(previousYearData) : [];

  // Combine current and previous year data by year
  const combinedData = currentYearDataByYear.map((currentYear) => {
    const prevYear = previousYearDataByYear.find(
      (p) => p.year === (Number(currentYear.year) - 1).toString()
    );
    return {
      year: currentYear.year,
      views: currentYear.views,
      interactions: currentYear.interactions,
      linkClicks: currentYear.linkClicks,
      prevViews: prevYear?.views || 0,
      prevInteractions: prevYear?.interactions || 0,
      prevLinkClicks: prevYear?.linkClicks || 0,
    };
  });

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 metric-card">
      <CardHeader>
        <CardTitle className="text-lg">Engagement Metrics Over Time (Year-over-Year Comparison)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={combinedData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#333333" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#333333" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A8A8A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8A8A8A" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPrevViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPrevInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#333333" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#333333" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPrevClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A8A8A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8A8A8A" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
                labelFormatter={(year) => `Year: ${year}`}
              />
              <Legend />

              <Area
                type="monotone"
                dataKey="views"
                name="Views (Current)"
                stroke="#D4AF37"
                fillOpacity={1}
                fill="url(#colorViews)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="interactions"
                name="Interactions (Current)"
                stroke="#333333"
                fillOpacity={1}
                fill="url(#colorInteractions)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="linkClicks"
                name="Clicks (Current)"
                stroke="#8A8A8A"
                fillOpacity={1}
                fill="url(#colorClicks)"
                activeDot={{ r: 6 }}
              />

              <Area
                type="monotone"
                dataKey="prevViews"
                name="Views (Previous Year)"
                stroke="#D4AF37"
                strokeDasharray="5 5"
                fill="none"
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="prevInteractions"
                name="Interactions (Previous Year)"
                stroke="#333333"
                strokeDasharray="5 5"
                fill="none"
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="prevLinkClicks"
                name="Clicks (Previous Year)"
                stroke="#8A8A8A"
                strokeDasharray="5 5"
                fill="none"
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
