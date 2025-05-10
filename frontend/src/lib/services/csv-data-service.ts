
import { DailyStats, DashboardData } from '../types/dashboard-types';
import { getPreviousYearData, calculateYoYChange } from '../utils/dashboard-utils';

export const processCSVData = (csvText: string): DailyStats[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
  const viewsIndex = headers.findIndex(h => h.toLowerCase().includes('view'));
  const interactionsIndex = headers.findIndex(h => h.toLowerCase().includes('interact'));
  const followsIndex = headers.findIndex(h => h.toLowerCase().includes('follow'));
  const clicksIndex = headers.findIndex(h => h.toLowerCase().includes('click'));
  const reachIndex = headers.findIndex(h => h.toLowerCase().includes('reach'));
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      date: values[dateIndex] || new Date().toISOString().split('T')[0],
      views: parseInt(values[viewsIndex]) || Math.floor(Math.random() * 1000) + 500,
      interactions: parseInt(values[interactionsIndex]) || Math.floor(Math.random() * 500) + 100,
      follows: parseInt(values[followsIndex]) || Math.floor(Math.random() * 50) + 10,
      linkClicks: parseInt(values[clicksIndex]) || Math.floor(Math.random() * 200) + 50,
      reach: parseInt(values[reachIndex]) || Math.floor(Math.random() * 2000) + 1000,
    };
  });
};

export const getDashboardDataFromCSV = (dailyStats: DailyStats[]): DashboardData => {
  const totalViews = dailyStats.reduce((sum, day) => sum + day.views, 0);
  const totalInteractions = dailyStats.reduce((sum, day) => sum + day.interactions, 0);
  const totalFollows = dailyStats.reduce((sum, day) => sum + day.follows, 0);
  const totalLinkClicks = dailyStats.reduce((sum, day) => sum + day.linkClicks, 0);
  const totalReach = dailyStats.reduce((sum, day) => sum + day.reach, 0);

  const previousYearStats = getPreviousYearData(dailyStats);
  
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
      { format: 'Image', views: Math.round(totalViews * 0.27), interactions: Math.round(totalInteractions * 0.27) },
      { format: 'Video', views: Math.round(totalViews * 0.36), interactions: Math.round(totalInteractions * 0.36) },
      { format: 'Carousel', views: Math.round(totalViews * 0.22), interactions: Math.round(totalInteractions * 0.22) },
      { format: 'Story', views: Math.round(totalViews * 0.15), interactions: Math.round(totalInteractions * 0.15) },
    ],
    totalViews,
    totalInteractions,
    totalFollows,
    totalLinkClicks,
    totalReach
  };
};
