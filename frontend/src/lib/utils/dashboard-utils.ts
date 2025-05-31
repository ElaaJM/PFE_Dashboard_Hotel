
import { DailyStats } from '../types/dashboard-types';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getLastNDaysRange = (days: number): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return { startDate, endDate };
};

export const calculateYoYChange = (current: number, previous: number): number => {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
};

export const getPreviousYearData = (currentData: DailyStats[]): DailyStats[] => {
  return currentData.map(stat => {
    const date = new Date(stat.date);
    date.setFullYear(date.getFullYear() - 1);
    
    // Simulate previous year data with some variation
    const variation = 0.7 + Math.random() * 0.6; // 30% lower to 30% higher
    
    return {
      date: date.toISOString().split('T')[0],
      views: Math.floor(stat.views * variation),
      interactions: Math.floor(stat.interactions * variation),
      follows: Math.floor(stat.follows * variation),
      linkClicks: Math.floor(stat.linkClicks * variation),
      reach: Math.floor(stat.reach * variation),
    };
  });
};
