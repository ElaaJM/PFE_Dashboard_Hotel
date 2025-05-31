
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

interface ReviewsPerYearChartProps {
  data: any[];
}

const ReviewsPerYearChart: React.FC<ReviewsPerYearChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews per Year</CardTitle>
        <CardDescription>Yearly review count trend</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} reviews`, 'Count']}
              labelFormatter={(label) => `Year: ${label}`}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
                      <p className="font-bold">{`Year: ${label}`}</p>
                      <p className="text-sm">{`${item.reviews} reviews`}</p>
                      {item.margin !== 0 && (
                        <p className="text-xs text-gray-500">
                          YoY change: <span className={item.margin > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.margin > 0 ? '+' : ''}{item.margin.toFixed(3)}%
                          </span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="reviews" 
              stroke="#D4AF37" 
              dot={{ r: 6, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              strokeWidth={3}
            />
            <ReferenceLine y={0} stroke="#666" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReviewsPerYearChart;
