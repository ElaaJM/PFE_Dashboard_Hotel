import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

import { getSourceColor } from '@/lib/utils/analytics';
import { SourceData } from '@/lib/types/review-types';

interface SourceChartProps {
  sourceData: SourceData[];
}

const SourceChart: React.FC<SourceChartProps> = ({ sourceData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews by Source</CardTitle>
        <CardDescription>Distribution across platforms</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sourceData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip 
              formatter={(value) => [`${value} reviews`, 'Count']} 
            />
            <Bar dataKey="value">
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSourceColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SourceChart;
