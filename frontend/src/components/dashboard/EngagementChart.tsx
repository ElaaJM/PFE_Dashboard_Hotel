
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyStats } from '@/lib/data-service';

interface EngagementChartProps {
  data: DailyStats[];
  previousYearData?: DailyStats[];
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data, previousYearData }) => {
  const combinedData = data.map((currentYear, index) => {
    const previousYear = previousYearData?.[index];
    return {
      date: currentYear.date,
      views: currentYear.views,
      interactions: currentYear.interactions,
      linkClicks: currentYear.linkClicks,
      prevViews: previousYear?.views,
      prevInteractions: previousYear?.interactions,
      prevLinkClicks: previousYear?.linkClicks,
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
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#333333" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#333333" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A8A8A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8A8A8A" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPrevViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPrevInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#333333" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#333333" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPrevClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A8A8A" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8A8A8A" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }}
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
