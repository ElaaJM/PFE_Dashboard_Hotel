
import { Review, ReviewAnalyticsData } from '../../types/review-types';
import { calculateSentimentDistribution, calculateSentimentByYear } from './sentiment-utils';
import { calculateSourceDistribution, calculateAvgScoreBySource, calculateTypeOfStayDistribution } from './source-utils';
import { calculateReviewsByCountry } from './country-utils';
import { calculateReviewScoreByYear, calculateReviewsPerYear, reviewScoreDistributionData } from './review-metrics';

// Generate analytics data based on the real metrics
export const generateAnalyticsData = (reviews: Review[]): ReviewAnalyticsData => {
  // Calculate sentiment distribution
  const sentimentData = calculateSentimentDistribution(reviews);
  
  // Calculate source distribution
  const sourceData = calculateSourceDistribution(reviews);
  
  // Calculate average score by source
  const avgScoreBySource = calculateAvgScoreBySource(reviews);
  
  // Calculate type of stay distribution
  const typeOfStayData = calculateTypeOfStayDistribution(reviews);
  
  // Calculate reviews by country
  const reviewsByCountry = calculateReviewsByCountry(reviews);
  
  // Calculate review score by year
  const reviewScoreByYear = calculateReviewScoreByYear();
  
  // Calculate reviews per year
  const reviewsPerYear = calculateReviewsPerYear();
  
  // Calculate sentiment by year 
  const sentimentByYearData = calculateSentimentByYear();
  
  return {
    sentimentData,
    sourceData,
    avgScoreBySource,
    typeOfStayData,
    reviewsByCountry,
    reviewScoreByYear,
    reviewsPerYear,
    sentimentByYearData
  };
};

// Get score distribution by year
export const getScoreDistributionByYear = (year: number) => {
  return reviewScoreDistributionData[year as keyof typeof reviewScoreDistributionData] || [];
};
