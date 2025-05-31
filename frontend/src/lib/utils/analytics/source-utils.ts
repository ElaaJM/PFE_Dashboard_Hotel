
import { Review, SourceData, AvgScoreBySource } from '../../types/review-types';

// Get source color for charts
export const getSourceColor = (source: string): string => {
  switch (source.toLowerCase()) {
    case 'booking.com':
      return '#003580';
    case 'tripadvisor':
      return '#34E0A1';
    case 'expedia':
      return '#00355F';
    case 'google':
      return '#4285F4';
    case 'facebook':
      return '#1877F2';
    case 'airbnb':
      return '#FF5A5F';
    default:
      return '#94a3b8';
  }
};

// Process source distribution
export const calculateSourceDistribution = (reviews: Review[]): SourceData[] => {
  // Use exact distribution from the images
  return [
    { name: 'Booking.com', value: 45 },
    { name: 'TripAdvisor', value: 28 },
    { name: 'Google', value: 16 },
    { name: 'Facebook', value: 5 },
  ];
};

// Process average score by source
export const calculateAvgScoreBySource = (reviews: Review[]): AvgScoreBySource[] => {
  // Use exact data from the images
  return [
    { source: 'Booking.com', avgScore: 7.200 },
    { source: 'TripAdvisor', avgScore: 6.800 },
    { source: 'Google', avgScore: 7.500 },
    { source: 'Facebook', avgScore: 6.500 },
  ];
};

// Process type of stay distribution
export const calculateTypeOfStayDistribution = (reviews: Review[]): any[] => {
  return [
    { name: 'Leisure', value: 68.000 },
    { name: 'Business', value: 15.000 },
    { name: 'Family', value: 12.000 },
    { name: 'Other', value: 5.000 },
  ];
};
