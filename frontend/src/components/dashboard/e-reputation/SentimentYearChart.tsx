import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getSentimentColor } from '@/lib/utils/analytics';

interface SentimentYearChartProps {
  data: any[];
}

const SentimentYearChart: React.FC<SentimentYearChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution by Year</CardTitle>
        <CardDescription>Yearly sentiment breakdown</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} reviews`, '']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Bar 
              name="Positive" 
              dataKey="positive" 
              stackId="a"
              fill={getSentimentColor('positive')}
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              name="Neutral" 
              dataKey="neutral" 
              stackId="a" 
              fill={getSentimentColor('neutral')}
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              name="Negative" 
              dataKey="negative" 
              stackId="a" 
              fill={getSentimentColor('negative')}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentYearChart;
