
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { getVisitsData } from '@/lib/services/mock-data-service';
import { formatNumber } from '@/lib/data-service';

const VisitsChart: React.FC = () => {
  const data = getVisitsData();

  return (
    <Card className="metric-card">
      <CardHeader>
        <CardTitle className="text-lg">Visits per Year</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), 'Visits']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Bar 
                dataKey="visits" 
                fill="#D4AF37" 
                radius={[4, 4, 0, 0]}
                barSize={60}
              >
                <LabelList 
                  dataKey="visits" 
                  position="top" 
                  formatter={(value: number) => formatNumber(value)} 
                  style={{ fontSize: '11px' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitsChart;