
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  onRangeChange: (days: number) => void;
  selectedRange: number;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onRangeChange,
  selectedRange
}) => {
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardContent className="p-2">
        <Tabs 
          defaultValue={selectedRange.toString()} 
          className="w-full"
          onValueChange={(value) => onRangeChange(parseInt(value))}
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="7">7 Days</TabsTrigger>
            <TabsTrigger value="30">30 Days</TabsTrigger>
            <TabsTrigger value="90">90 Days</TabsTrigger>
            <TabsTrigger value="180">6 Months</TabsTrigger>
            <TabsTrigger value="270">9 Months</TabsTrigger>
            <TabsTrigger value="365">1 Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DateRangeSelector;
