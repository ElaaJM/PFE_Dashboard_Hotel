
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getContentFormatData } from '@/lib/services/mock-data-service';
import { formatNumber } from '@/lib/data-service';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContentTypeChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const contentFormatData = getContentFormatData();
  
  // Define colors for consistent rendering
  const barColors = [
    "#D4AF37", "#333333", "#8A7020", "#625018", 
    "#B39530", "#A68C2E", "#C9A842", "#E5BE57", "#F7CA45"
  ];
  
  // Filter data to show only important content types
  const importantTypes = ['Links', 'Photos', 'Reels', 'Stories', 'Text', 'Videos', 'Multi photo'];
  const filteredData = contentFormatData[selectedYear]
    .filter(item => importantTypes.includes(item.name))
    .map(item => ({
      name: item.name,
      value: item.value
    }));

  // Create data for grouped bar chart
  const groupedData = [
    {
      year: '2022',
      ...Object.fromEntries(
        contentFormatData['2022']
          .filter(item => importantTypes.includes(item.name))
          .map(item => [item.name.replace(' ', '_'), item.value])
      )
    },
    {
      year: '2023',
      ...Object.fromEntries(
        contentFormatData['2023']
          .filter(item => importantTypes.includes(item.name))
          .map(item => [item.name.replace(' ', '_'), item.value])
      )
    },
    {
      year: '2024',
      ...Object.fromEntries(
        contentFormatData['2024']
          .filter(item => importantTypes.includes(item.name))
          .map(item => [item.name.replace(' ', '_'), item.value])
      )
    }
  ];

  return (
    <Card className="metric-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Type per Year</CardTitle>
        <Tabs 
          value={selectedYear} 
          onValueChange={setSelectedYear}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="2022">2022</TabsTrigger>
            <TabsTrigger value="2023">2023</TabsTrigger>
            <TabsTrigger value="2024">2024</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={groupedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [formatNumber(value), name.replace('_', ' ')]}
              />
              <Legend />
              {importantTypes.map((type, index) => (
                <Bar 
                  key={type}
                  dataKey={type.replace(' ', '_')} 
                  name={type}
                  fill={barColors[index % barColors.length]} 
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTypeChart;