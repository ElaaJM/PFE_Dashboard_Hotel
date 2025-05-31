import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { AvgScoreBySource } from '@/lib/types/review-types';
import { getSourceColor } from '@/lib/utils/analytics';

interface AvgScoreChartProps {
  avgScoreBySource: AvgScoreBySource[];
}

const AvgScoreChart: React.FC<AvgScoreChartProps> = ({ avgScoreBySource }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Rating by Source</CardTitle>
        <CardDescription>Comparing ratings across platforms</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={avgScoreBySource}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis domain={[0, 5]} />
            <Tooltip 
              formatter={(value) => [`${Number(value).toFixed(1)} / 5`, 'Average Rating']}
            />
            <Bar dataKey="avgScore" name="Average Rating">
              {avgScoreBySource.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSourceColor(entry.source)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AvgScoreChart;
