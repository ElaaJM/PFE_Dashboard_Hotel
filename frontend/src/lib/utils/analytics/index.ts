
// Main index file to re-export all analytics utilities

// Re-export color utilities
export { getSentimentColor } from './sentiment-utils';
export { getSourceColor } from './source-utils';
export { 
  getCountryColor, 
  countryCodeToName, 
  reviewsByCountryAndYear, 
  countriesTrendingData,
  topCountriesForTrending
} from './country-utils';

// Re-export data
export { 
  reviewTotalsByYear,
  reviewScoresByYear,
  reviewsBySourceAndYear,
  reviewScoreDistributionData
} from './review-metrics';

export {
  sentimentByYear,
  positivePercentageByYear,
  negativePercentageByYear,
  calculateSentimentDistribution
} from './sentiment-utils';

export { reviewsByYear } from './reviews-by-year';

// Re-export generator functions
export { generateAnalyticsData, getScoreDistributionByYear } from './review-analytics';
export { mockReviewData } from './mock-data-generator';
