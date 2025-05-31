
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateRangeSelectorProps {
  onRangeChange: (days: number) => void;
  selectedRange: number;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onRangeChange,
  selectedRange
}) => {
  const handleYearChange = (year: string) => {
    // Map years to their respective values
    const yearMap: Record<string, number> = {
      '2022': 2022,
      '2023': 2023,
      '2024': 2024
    };
    
    onRangeChange(yearMap[year]);
  };
  
  // Determine which year is selected based on the selectedRange
  let selectedYear = '2024';
  if (selectedRange === 2022) selectedYear = '2022';
  if (selectedRange === 2023) selectedYear = '2023';
  
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardContent className="p-2">
        <Tabs 
          value={selectedYear} 
          className="w-full"
          onValueChange={(value) => handleYearChange(value)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="2022">2022</TabsTrigger>
            <TabsTrigger value="2023">2023</TabsTrigger>
            <TabsTrigger value="2024">2024</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DateRangeSelector;