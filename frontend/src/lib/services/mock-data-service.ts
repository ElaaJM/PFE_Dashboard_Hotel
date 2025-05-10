
import { DailyStats, DashboardData } from '../types/dashboard-types';
import { getPreviousYearData, calculateYoYChange } from '../utils/dashboard-utils';

export const getMockDashboardData = (days: number = 30): DashboardData => {
  // Ensure days doesn't exceed 365
  const safeDays = Math.min(days, 365);
  
  // Generate daily stats for the requested number of days
  const dailyStats: DailyStats[] = Array.from({ length: safeDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (safeDays - 1 - i));
    
    // Add seasonality patterns
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;
    const dayOfMonth = date.getDate();
    const monthFactor = 1 + 0.2 * Math.sin((dayOfMonth / 30) * Math.PI);
    const month = date.getMonth();
    const seasonalFactor = 1 + 0.3 * Math.sin(((month + 1) / 12) * Math.PI * 2);
    const growthFactor = 1 + (i / safeDays) * 0.5;
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    const combinedFactor = weekendFactor * monthFactor * seasonalFactor * growthFactor * randomFactor;
    
    return {
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 1000 * combinedFactor) + 500,
      interactions: Math.floor(Math.random() * 500 * combinedFactor) + 100,
      follows: Math.floor(Math.random() * 50 * combinedFactor) + 10,
      linkClicks: Math.floor(Math.random() * 200 * combinedFactor) + 50,
      reach: Math.floor(Math.random() * 2000 * combinedFactor) + 1000,
    };
  });

  const previousYearStats = getPreviousYearData(dailyStats);
  
  const totalViews = dailyStats.reduce((sum, day) => sum + day.views, 0);
  const totalInteractions = dailyStats.reduce((sum, day) => sum + day.interactions, 0);
  const totalFollows = dailyStats.reduce((sum, day) => sum + day.follows, 0);
  const totalLinkClicks = dailyStats.reduce((sum, day) => sum + day.linkClicks, 0);
  const totalReach = dailyStats.reduce((sum, day) => sum + day.reach, 0);

  const previousYearTotals = previousYearStats.reduce((totals, day) => ({
    views: totals.views + day.views,
    interactions: totals.interactions + day.interactions,
    follows: totals.follows + day.follows,
    linkClicks: totals.linkClicks + day.linkClicks,
    reach: totals.reach + day.reach,
  }), {
    views: 0,
    interactions: 0,
    follows: 0,
    linkClicks: 0,
    reach: 0,
  });

  return {
    dailyStats,
    previousYearStats,
    yoyChanges: {
      views: calculateYoYChange(totalViews, previousYearTotals.views),
      interactions: calculateYoYChange(totalInteractions, previousYearTotals.interactions),
      follows: calculateYoYChange(totalFollows, previousYearTotals.follows),
      linkClicks: calculateYoYChange(totalLinkClicks, previousYearTotals.linkClicks),
      reach: calculateYoYChange(totalReach, previousYearTotals.reach),
    },
    audienceGender: [
      { gender: 'Male', percentage: 42 },
      { gender: 'Female', percentage: 56 },
      { gender: 'Other', percentage: 2 },
    ],
    audienceAge: [
      { ageGroup: '18-24', percentage: 15 },
      { ageGroup: '25-34', percentage: 32 },
      { ageGroup: '35-44', percentage: 28 },
      { ageGroup: '45-54', percentage: 18 },
      { ageGroup: '55+', percentage: 7 },
    ],
    topCountries: [
      { name: 'United States', value: 42 },
      { name: 'United Kingdom', value: 18 },
      { name: 'Germany', value: 12 },
      { name: 'France', value: 9 },
      { name: 'Canada', value: 7 },
    ],
    topCities: [
      { name: 'New York', value: 12 },
      { name: 'London', value: 10 },
      { name: 'Paris', value: 7 },
      { name: 'Berlin', value: 6 },
      { name: 'Toronto', value: 5 },
    ],
    contentFormats: [
      { format: 'Image', views: 18500, interactions: 9200 },
      { format: 'Video', views: 24700, interactions: 12100 },
      { format: 'Carousel', views: 15300, interactions: 8700 },
      { format: 'Story', views: 9800, interactions: 4300 },
    ],
    totalViews,
    totalInteractions,
    totalFollows,
    totalLinkClicks,
    totalReach
  };
};
