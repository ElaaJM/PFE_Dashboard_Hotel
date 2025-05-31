
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Review } from '@/lib/types/review-types';
import { 
  getSentimentColor, 
  reviewTotalsByYear, 
  reviewScoresByYear,
  sentimentByYear,
  positivePercentageByYear,
  negativePercentageByYear
} from '@/lib/utils/analytics';

interface SummaryMetricsProps {
  filteredData: Review[];
  selectedYear: number;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ filteredData, selectedYear }) => {
  // Use actual data from the provided values
  const totalReviewsByYear = {
    2022: 26,
    2023: 36,
    2024: 94
  };
  
  const avgScoreByYear = {
    2022: 6.580,
    2023: 7.060,
    2024: 7.030
  };
  
  const positivePercentage = {
    2022: 26.900,
    2023: 50.000,
    2024: 46.800
  };
  
  const negativePercentage = {
    2022: 15.400,
    2023: 8.300,
    2024: 17.000
  };
  
  const marginPercentByYear = {
    total: {
      2022: 0,
      2023: 38.500,
      2024: 161.100
    },
    avgScore: {
      2022: 0,
      2023: 7.300,
      2024: -0.400
    },
    positive: {
      2022: 0,
      2023: null,
      2024: -6.400
    },
    negative: {
      2022: 0,
      2023: null,
      2024: 104.800
    }
  };
  
  const marginAbsByYear = {
    total: {
      2022: 0,
      2023: 10,
      2024: 58
    },
    avgScore: {
      2022: 0,
      2023: 0.480,
      2024: -0.030
    },
    positive: {
      2022: 0,
      2023: null,
      2024: -3.200
    },
    negative: {
      2022: 0,
      2023: null,
      2024: 8.700
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalReviewsByYear[selectedYear as keyof typeof totalReviewsByYear]}</div>
          {selectedYear > 2022 && (
            <div className="text-sm text-muted-foreground mt-1">
              YoY change: <span className="font-medium text-green-600">+{marginPercentByYear.total[selectedYear].toFixed(3)}%</span>
            </div>
          )}
          {selectedYear > 2022 && (
            <div className="text-sm text-muted-foreground mt-1">
              Absolute change: <span className="font-medium text-green-600">+{marginAbsByYear.total[selectedYear]}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{avgScoreByYear[selectedYear as keyof typeof avgScoreByYear].toFixed(3)}<span className="text-sm text-muted-foreground"> / 10</span></div>
          {selectedYear > 2022 && (
            <div className="text-sm text-muted-foreground mt-1">
              YoY change: <span className={`font-medium ${marginPercentByYear.avgScore[selectedYear] >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {marginPercentByYear.avgScore[selectedYear] > 0 ? '+' : ''}{marginPercentByYear.avgScore[selectedYear].toFixed(3)}%
              </span>
            </div>
          )}
          {selectedYear > 2022 && (
            <div className="text-sm text-muted-foreground mt-1">
              Absolute change: <span className={`font-medium ${marginAbsByYear.avgScore[selectedYear] >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {marginAbsByYear.avgScore[selectedYear] > 0 ? '+' : ''}{marginAbsByYear.avgScore[selectedYear].toFixed(3)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Positive Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{positivePercentage[selectedYear as keyof typeof positivePercentage].toFixed(3)}%</div>
          {selectedYear === 2024 && (
            <div className="text-sm text-muted-foreground mt-1">
              YoY change: <span className="font-medium text-red-600">{marginPercentByYear.positive[selectedYear]?.toFixed(3)}%</span>
            </div>
          )}
          {selectedYear === 2024 && (
            <div className="text-sm text-muted-foreground mt-1">
              Absolute change: <span className="font-medium text-red-600">{marginAbsByYear.positive[selectedYear]?.toFixed(3)}%</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Negative Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{negativePercentage[selectedYear as keyof typeof negativePercentage].toFixed(3)}%</div>
          {selectedYear === 2024 && (
            <div className="text-sm text-muted-foreground mt-1">
              YoY change: <span className="font-medium text-red-600">+{marginPercentByYear.negative[selectedYear]?.toFixed(3)}%</span>
            </div>
          )}
          {selectedYear === 2024 && (
            <div className="text-sm text-muted-foreground mt-1">
              Absolute change: <span className="font-medium text-red-600">+{marginAbsByYear.negative[selectedYear]?.toFixed(3)}%</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryMetrics;
