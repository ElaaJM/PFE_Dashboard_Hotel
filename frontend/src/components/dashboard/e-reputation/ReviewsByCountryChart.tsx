
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getCountryColor, countriesTrendingData, topCountriesForTrending } from '@/lib/utils/analytics';

interface ReviewsByCountryChartProps {
  selectedYear: number;
}

const ReviewsByCountryChart: React.FC<ReviewsByCountryChartProps> = ({ selectedYear }) => {
  // We'll use all the data for the trend chart regardless of selected year
  const chartData = countriesTrendingData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews by Country</CardTitle>
        <CardDescription>Year-over-Year country distribution comparison</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <defs>
              {topCountriesForTrending.map((country) => (
                <linearGradient 
                  key={`gradient-${country}`} 
                  id={`color${country.replace(/[().\s+]/g, '')}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop offset="5%" stopColor={getCountryColor(country)} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={getCountryColor(country)} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            />
            <Legend />
            
            {topCountriesForTrending.map((country) => (
              <Area 
                key={country}
                type="monotone" 
                dataKey={country}
                name={country}
                stroke={getCountryColor(country)} 
                fillOpacity={1}
                fill={`url(#color${country.replace(/[().\s+]/g, '')})`} 
                activeDot={{ r: 6 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReviewsByCountryChart;
