
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { reviewScoreDistributionData } from '@/lib/utils/analytics';

interface ReviewScoreDistributionChartProps {
  selectedYear: number;
}

const ReviewScoreDistributionChart: React.FC<ReviewScoreDistributionChartProps> = ({ selectedYear }) => {
  const chartData = reviewScoreDistributionData[selectedYear as keyof typeof reviewScoreDistributionData] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Score Distribution ({selectedYear})</CardTitle>
        <CardDescription>Histogram of review scores</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="score"
              label={{ value: 'Score', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} reviews`, 'Count']}
              labelFormatter={(label) => `Score: ${label}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Reviews" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReviewScoreDistributionChart;
