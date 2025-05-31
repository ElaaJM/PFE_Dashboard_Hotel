
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";

interface ReviewScoreChartProps {
  data: any[];
}

const ReviewScoreChart: React.FC<ReviewScoreChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Review Score</CardTitle>
        <CardDescription>Yearly average score trend</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 10]} />
            <Tooltip 
              formatter={(value) => {
                // Check if the value is a number before using toFixed
                return typeof value === 'number' 
                  ? [`${value.toFixed(3)} / 10`, 'Average Score'] 
                  : [value, 'Average Score'];
              }}
              labelFormatter={(label) => `Year: ${label}`}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
                      <p className="font-bold">{`Year: ${label}`}</p>
                      <p className="text-sm">{`${typeof item.avgScore === 'number' ? item.avgScore.toFixed(3) : item.avgScore} / 10`}</p>
                      {item.margin !== 0 && (
                        <p className="text-xs text-gray-500">
                          YoY change: <span className={item.margin > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.margin > 0 ? '+' : ''}{typeof item.margin === 'number' ? item.margin.toFixed(3) : item.margin}%
                          </span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="avgScore" 
              fill="#D4AF37" 
              barSize={60}
              radius={[4, 4, 0, 0]}
            >
              <LabelList 
                dataKey="avgScore" 
                position="top" 
                formatter={(value: any) => typeof value === 'number' ? value.toFixed(3) : value} 
                style={{ fontSize: '11px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReviewScoreChart;
