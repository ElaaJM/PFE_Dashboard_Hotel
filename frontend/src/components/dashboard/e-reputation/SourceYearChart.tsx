
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

import { SOURCE_COLORS } from '@/components/ui/chart/constants';

interface SourceYearChartProps {
  data: any[];
}

const SourceYearChart: React.FC<SourceYearChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews by Source and Year</CardTitle>
        <CardDescription>Distribution across platforms over time</CardDescription>
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
              formatter={(value, name) => {
                if (name === 'Total') return [`${value} total reviews`, name];
                return [`${value} reviews`, name];
              }}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Bar dataKey="unknown" name="Unknown" fill={SOURCE_COLORS.Default} />
            <Bar dataKey="Google" name="Google" fill={SOURCE_COLORS.Google} />
            <Bar dataKey="Tripadvisor" name="TripAdvisor" fill={SOURCE_COLORS.TripAdvisor} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SourceYearChart;
