
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import { getSentimentColor } from '@/lib/utils/analytics';
import { SentimentData } from '@/lib/types/review-types';

interface SentimentChartProps {
  sentimentData: SentimentData[];
  totalReviews: number;
  selectedYear: number;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentimentData, totalReviews, selectedYear }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution ({selectedYear})</CardTitle>
        <CardDescription>Review sentiment breakdown</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSentimentColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} reviews`, 'Count']}
              content={(props) => {
                const { active, payload } = props;
                if (active && payload && payload.length) {
                  const data = payload[0].payload as SentimentData;
                  return (
                    <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                      <p className="font-medium">{data.name}</p>
                      <p>{`${data.value} reviews (${((data.value/totalReviews)*100).toFixed(1)}%)`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
