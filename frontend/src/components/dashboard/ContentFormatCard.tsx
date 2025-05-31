
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ContentFormat } from '@/lib/data-service';

interface ContentFormatCardProps {
  data: ContentFormat[];
}

const ContentFormatCard: React.FC<ContentFormatCardProps> = ({ data }) => {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 metric-card">
      <CardHeader>
        <CardTitle className="text-lg">Content Format Performance</CardTitle>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="format" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              />
              <Legend />
              <Bar 
                name="Views" 
                dataKey="views" 
                fill="#D4AF37" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                name="Interactions" 
                dataKey="interactions" 
                fill="#333333" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentFormatCard;
