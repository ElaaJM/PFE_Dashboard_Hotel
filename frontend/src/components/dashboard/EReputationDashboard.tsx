
import React, { useState, useEffect } from 'react';
import SummaryMetrics from './e-reputation/SummaryMetrics';
import ReviewsPerYearChart from './e-reputation/ReviewsPerYearChart';
import ReviewScoreChart from './e-reputation/ReviewScoreChart';
import SentimentYearChart from './e-reputation/SentimentYearChart';
import ReviewsByCountryChart from './e-reputation/ReviewsByCountryChart';
import ReviewScoreDistributionChart from './e-reputation/ReviewScoreDistributionChart';
import SourceYearChart from './e-reputation/SourceYearChart';
import DateRangeSelector from './DateRangeSelector';
import SentimentChart from './e-reputation/SentimentChart';
import SourceChart from './e-reputation/SourceChart';
import { 
  generateAnalyticsData, 
  reviewsByYear,
  calculateSentimentDistribution
} from '@/lib/utils/analytics';
import { Review, ReviewAnalyticsData } from '@/lib/types/review-types';
import { sentimentByYear, positivePercentageByYear, negativePercentageByYear } from '@/lib/utils/analytics';

const EReputationDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [filteredData, setFilteredData] = useState<Review[]>(reviewsByYear[2024]);
  const [analytics, setAnalytics] = useState<ReviewAnalyticsData>(generateAnalyticsData(reviewsByYear[2024]));
  
  // Source data by year
  const reviewsBySourceAndYear = [
    { year: '2022', unknown: 10, Google: 16, Tripadvisor: 0, Total: 26 },
    { year: '2023', unknown: 0, Google: 33, Tripadvisor: 3, Total: 36 },
    { year: '2024', unknown: 42, Google: 43, Tripadvisor: 9, Total: 94 }
  ];
  
  // Get unique sources for the filter including the new sources from the data
  const sources = ['unknown', 'Google', 'Tripadvisor'];

  // For sentiment chart's total calculation based on year
  const getTotalReviewsByYear = (year: number) => {
    const yearData = sentimentByYear[year as keyof typeof sentimentByYear];
    if (!yearData) return 0;
    
    return Object.values(yearData).reduce((sum, count) => sum + count, 0);
  };

  useEffect(() => {
    // When the selected year changes, update the initial data
    const yearData = reviewsByYear[selectedYear];
    setFilteredData(yearData);
    
    // Update analytics with the sentiment data for the selected year
    const updatedAnalytics = generateAnalyticsData(yearData);
    updatedAnalytics.sentimentData = calculateSentimentDistribution(yearData, selectedYear);
    
    setAnalytics(updatedAnalytics);
  }, [selectedYear]);

  useEffect(() => {
    const yearData = reviewsByYear[selectedYear];
    
    const filtered = yearData.filter(review => {
      const matchesSearch = searchQuery === '' || 
        review.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = selectedSource === 'all' || review.source === selectedSource;
      
      return matchesSearch && matchesSource;
    });
    
    setFilteredData(filtered);
    
    // Update analytics with the sentiment data for the selected year
    const updatedAnalytics = generateAnalyticsData(filtered);
    updatedAnalytics.sentimentData = calculateSentimentDistribution(filtered, selectedYear);
    
    setAnalytics(updatedAnalytics);
  }, [searchQuery, selectedSource, selectedYear]);

  // Handle year change from DateRangeSelector
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="animate-fade-in">
<div className="text-center mb-6">
        <h2 className="text-3xl font-semibold mb-2">E-Reputation Analytics</h2>
        <p className="text-muted-foreground mb-2">
          Monitor and analyze guest reviews from multiple online platforms
        </p>

      </div>
      
      {/* Year Selector */}
      <div className="mb-6">
        <DateRangeSelector 
          onRangeChange={handleYearChange}
          selectedRange={selectedYear}
        />
      </div>
      
      {/* Analytics Cards */}
      <SummaryMetrics 
        filteredData={filteredData} 
        selectedYear={selectedYear}
      />
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReviewsPerYearChart data={analytics.reviewsPerYear} />
        <ReviewScoreChart data={analytics.reviewScoreByYear} />
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SentimentYearChart data={analytics.sentimentByYearData} />
        <ReviewsByCountryChart selectedYear={selectedYear} />
      </div>
      
      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SourceYearChart data={reviewsBySourceAndYear} />
        <ReviewScoreDistributionChart selectedYear={selectedYear} />
      </div>
      
      {/* Charts Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SentimentChart 
          sentimentData={analytics.sentimentData} 
          totalReviews={getTotalReviewsByYear(selectedYear)}
          selectedYear={selectedYear}
        />
        <SourceChart sourceData={analytics.sourceData} />
      </div>
      

      

    </div>
  );
};

export default EReputationDashboard;