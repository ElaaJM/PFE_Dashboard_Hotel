
import { Review, SentimentData } from '../../types/review-types';

// Get sentiment color for charts
export const getSentimentColor = (sentiment: string): string => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return '#4ade80';
    case 'neutral':
      return '#fbbf24';
    case 'negative':
      return '#f87171';
    default:
      return '#94a3b8';
  }
};

// Sentiment data by year - based on the provided statistics
export const sentimentByYear = {
  2022: { Positive: 7, Neutral: 15, Negative: 4 },
  2023: { Positive: 18, Neutral: 15, Negative: 3 },
  2024: { Positive: 44, Neutral: 35, Negative: 15 }
};

// Percentages for positive sentiment by year
export const positivePercentageByYear = {
  2022: 26.900,
  2023: 50.000,
  2024: 46.800
};

// Percentages for negative sentiment by year
export const negativePercentageByYear = {
  2022: 15.400,
  2023: 8.300,
  2024: 17.000
};

// Calculate sentiment distribution based on the selected year
export const calculateSentimentDistribution = (reviews: Review[], selectedYear: number = 2024): SentimentData[] => {
  const data = sentimentByYear[selectedYear as keyof typeof sentimentByYear] || sentimentByYear[2024];
  
  return Object.keys(data).map(key => ({
    name: key,
    value: data[key as keyof typeof data]
  }));
};

// Calculate sentiment by year for the chart
export const calculateSentimentByYear = (): any[] => {
  return [
    { year: '2022', positive: 7, neutral: 15, negative: 4 },
    { year: '2023', positive: 18, neutral: 15, negative: 3 },
    { year: '2024', positive: 44, neutral: 35, negative: 15 }
  ];
};
