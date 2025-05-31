
import { DailyStats, DashboardData } from '../types/dashboard-types';
import { getPreviousYearData, calculateYoYChange } from '../utils/dashboard-utils';

// Data from the provided images
const facebookMetrics = {
  views: {
    '2022': 1907,
    '2023': 1791612,
    '2024': 1791612,
    yoy: 93849.200
  },
  visits: {
    '2022': 1712,
    '2023': 85196,
    '2024': 84227,
    yoy: -1.100
  },
  linkClicks: {
    '2022': 8000,
    '2023': 11479,
    '2024': 3005,
    yoy: -73.800
  },
  interactions: {
    '2022': 12000,
    '2023': 17958,
    '2024': 9438,
    yoy: -47.400
  },
  reach: {
    '2022': 800000,
    '2023': 1074560,
    '2024': 608213,
    yoy: -43.400
  },
  follows: {
    '2022': 4309,
    '2023': 618,
    '2024': 403,
    yoy: -34.800
  }
};

const audienceData = {
  gender: [
    { name: 'Female', value: 5978 },
    { name: 'Male', value: 4022 }
  ],
  age: [
    { name: '18-24', value: 3016 },
    { name: '25-34', value: 3990 },
    { name: '35-44', value: 2004 },
    { name: '45+', value: 990 }
  ],
  countries: [
    { name: 'Tunisia', value: 6000 },
    { name: 'France', value: 3010 },
    { name: 'Other', value: 990 }
  ]
};

// Content formats from the image data
const contentFormats = {
  '2022': {
    Links: 19860,
    Photos: 109485,
    Reels: 20853,
    Stories: 6486, 
    Text: 9268,
    Videos: 5296,
    "Multi photo": 12247,
    "Multi media": 5,
    Others: 112871
  },
  '2023': {
    Links: 21900,
    Photos: 120450,
    Reels: 22824,
    Stories: 6935, 
    Text: 10220,
    Videos: 5524,
    "Multi photo": 13505,
    "Multi media": 0,
    Others: 124302
  },
  '2024': {
    Links: 21653,
    Photos: 120780,
    Reels: 22692,
    Stories: 6954, 
    Text: 10059,
    Videos: 5490,
    "Multi photo": 13224,
    "Multi media": 0,
    Others: 124440
  }
};

export const getMockDashboardData = (year: number = 2024): DashboardData => {
  // Normalize the year parameter to one of our valid years
  const selectedYear = year === 2022 ? '2022' : year === 2023 ? '2023' : '2024';
  
  // Generate sample daily stats for the selected year
  const daysInYear = selectedYear === '2022' ? 365 : selectedYear === '2023' ? 365 : 366; // 2024 is a leap year
  const dailyStats: DailyStats[] = Array.from({ length: daysInYear }, (_, i) => {
    const date = new Date(Number(selectedYear), 0, i + 1);
    if (date > new Date()) return null; // Don't generate future dates
    
    // Get the annual totals for the selected year
    const yearlyViews = facebookMetrics.views[selectedYear] || 0;
    const yearlyInteractions = facebookMetrics.interactions[selectedYear] || 0;
    const yearlyFollows = facebookMetrics.follows[selectedYear] || 0;
    const yearlyLinkClicks = facebookMetrics.linkClicks[selectedYear] || 0;
    const yearlyReach = facebookMetrics.reach[selectedYear] || 0;
    
    // Distribute the yearly totals across days (with some randomization)
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;
    const randomFactor = 0.7 + Math.random() * 0.6;
    const combinedFactor = weekendFactor * randomFactor;
    
    return {
      date: date.toISOString().split('T')[0],
      views: Math.floor((yearlyViews / daysInYear) * combinedFactor),
      interactions: Math.floor((yearlyInteractions / daysInYear) * combinedFactor),
      follows: Math.floor((yearlyFollows / daysInYear) * combinedFactor) || 1,
      linkClicks: Math.floor((yearlyLinkClicks / daysInYear) * combinedFactor),
      reach: Math.floor((yearlyReach / daysInYear) * combinedFactor),
    };
  }).filter(Boolean) as DailyStats[];

  // Mock previous year stats for comparison
  const previousYearStats = selectedYear === '2022' ? [] : getPreviousYearData(dailyStats);
  
  // Get content format data for the selected year
  const selectedContentFormats = contentFormats[selectedYear];
  const formattedContentFormats = Object.entries(selectedContentFormats)
    .filter(([key]) => !["Others", "Multi media", "Multi photo"].includes(key))
    .map(([format, views]) => ({
      format,
      views: views as number,
      interactions: Math.floor((views as number) / 2)
    }));

  return {
    dailyStats,
    previousYearStats,
    yoyChanges: {
      views: facebookMetrics.views.yoy || 0,
      interactions: facebookMetrics.interactions.yoy || 0,
      follows: facebookMetrics.follows.yoy || 0,
      linkClicks: facebookMetrics.linkClicks.yoy || 0,
      reach: facebookMetrics.reach.yoy || 0,
    },
    audienceGender: [
      { gender: 'Male', percentage: 40.220 },
      { gender: 'Female', percentage: 59.780 },
    ],
    audienceAge: [
      { ageGroup: '18-24', percentage: 30.160 },
      { ageGroup: '25-34', percentage: 39.900 },
      { ageGroup: '35-44', percentage: 20.040 },
      { ageGroup: '45+', percentage: 9.900 },
    ],
    topCountries: [
      { name: 'Tunisia', value: 60 },
      { name: 'France', value: 30 },
      { name: 'Other', value: 10 },
    ],
    topCities: [
      { name: 'Tunis', value: 35 },
      { name: 'Paris', value: 20 },
      { name: 'Hammamet', value: 15 },
      { name: 'Sousse', value: 12 },
      { name: 'Marseille', value: 8 },
    ],
    contentFormats: formattedContentFormats,
    totalViews: facebookMetrics.views[selectedYear] || 0,
    totalInteractions: facebookMetrics.interactions[selectedYear] || 0,
    totalFollows: facebookMetrics.follows[selectedYear] || 0,
    totalLinkClicks: facebookMetrics.linkClicks[selectedYear] || 0,
    totalReach: facebookMetrics.reach[selectedYear] || 0
  };
};

// Export content format data for specific charts
export const getContentFormatData = () => {
  return {
    '2022': Object.entries(contentFormats['2022']).map(([key, value]) => ({ 
      name: key, 
      value: value as number 
    })),
    '2023': Object.entries(contentFormats['2023']).map(([key, value]) => ({ 
      name: key, 
      value: value as number 
    })),
    '2024': Object.entries(contentFormats['2024']).map(([key, value]) => ({ 
      name: key, 
      value: value as number 
    })),
  };
};

// Export visit data for bar chart
export const getVisitsData = () => [
  { year: '2022', visits: 1712, margin: 0 },
  { year: '2023', visits: 85196, margin: 4876.400 },
  { year: '2024', visits: 84227, margin: -1.100 }
];

// Export followers data for bar chart
export const getFollowersData = () => [
  { year: '2022', followers: 4309, margin: 0 },
  { year: '2023', followers: 618, margin: -85.700 },
  { year: '2024', followers: 403, margin: -34.800 }
];

// Export audience data for pie charts
export const getAudienceData = () => ({
  gender: audienceData.gender,
  age: audienceData.age,
  countries: audienceData.countries
});