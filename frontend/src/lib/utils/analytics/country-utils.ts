
import { Review } from '../../types/review-types';

// Get color for country
export const getCountryColor = (country: string): string => {
  const colorMap: Record<string, string> = {
    'France': '#3b82f6',
    'Italy': '#10b981',
    'Spain': '#f59e0b',
    'Romania': '#8b5cf6',
    'Greece': '#06b6d4',
    'Tunisia': '#ec4899',
    'Germany': '#f97316',
    'UK': '#6366f1',
    'Canada': '#ef4444',
    'Lebanon': '#14b8a6',
    'Allemagne': '#f97316',
    'Tunisie': '#ec4899',
    'Égypte': '#d97706',
    'Ukraine': '#9333ea',
    'unknown': '#94a3b8',
    '(unknown)': '#94a3b8',
    'Arabie Saoudite': '#84cc16',
    'Espagne': '#f59e0b',
    'Grèce': '#06b6d4',
    'Indonésie': '#0ea5e9',
    'Italie': '#10b981',
    'Liban': '#14b8a6',
    'Libye': '#7c3aed',
    'Pays-Bas': '#0284c7',
    'Roumanie': '#8b5cf6',
    'Royaume-Uni': '#6366f1'
  };
  
  return colorMap[country] || '#94a3b8';
};

// Convert country code to name
export const countryCodeToName = (code: string): string => {
  const countryMap: Record<string, string> = {
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'RO': 'Romania',
    'GR': 'Greece',
    'TN': 'Tunisia',
    'DE': 'Germany',
    'GB': 'UK',
    'CA': 'Canada',
    'LB': 'Lebanon',
    'EG': 'Égypte',
    'UA': 'Ukraine',
    'SA': 'Arabie Saoudite',
    'ID': 'Indonésie',
    'LY': 'Libye',
    'NL': 'Pays-Bas'
    // Removed duplicates that had French names
  };
  
  return countryMap[code] || code;
};

// Calculate reviews by country
export const calculateReviewsByCountry = (reviews: Review[]): any[] => {
  const countryData = reviews.reduce((acc: Record<string, number>, review) => {
    const country = review.country || 'unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(countryData).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);
};

// Reviews by country and year - updated with the exact data provided by the user
export const reviewsByCountryAndYear = {
  2022: [
    { country: '(unknown)', reviews: 16 },
    { country: 'France', reviews: 5 },
    { country: 'Allemagne', reviews: 1 },
    { country: 'Tunisie', reviews: 2 },
    { country: 'Ukraine', reviews: 1 },
    { country: 'Égypte', reviews: 1 }
  ],
  2023: [
    { country: '(unknown)', reviews: 36 }
  ],
  2024: [
    { country: '(unknown)', reviews: 52 },
    { country: 'France', reviews: 15 },
    { country: 'Allemagne', reviews: 4 },
    { country: 'Tunisie', reviews: 4 },
    { country: 'Arabie Saoudite', reviews: 1 },
    { country: 'Canada', reviews: 1 },
    { country: 'Espagne', reviews: 2 },
    { country: 'Grèce', reviews: 1 },
    { country: 'Indonésie', reviews: 1 },
    { country: 'Italie', reviews: 4 },
    { country: 'Liban', reviews: 1 },
    { country: 'Libye', reviews: 1 },
    { country: 'Pays-Bas', reviews: 1 },
    { country: 'Roumanie', reviews: 1 },
    { country: 'Royaume-Uni', reviews: 5 }
  ]
};

// Top countries for trending chart - the most significant ones for visualization
export const topCountriesForTrending = ['(unknown)', 'France', 'Allemagne', 'Tunisie', 'Royaume-Uni', 'Italie'];

// Updated trending data with the exact numbers provided by the user
export const countriesTrendingData = () => {
  return [
    { 
      year: '2022', 
      '(unknown)': 16, 
      'France': 5, 
      'Allemagne': 1, 
      'Tunisie': 2, 
      'Royaume-Uni': 0,
      'Italie': 0
    },
    { 
      year: '2023', 
      '(unknown)': 36, 
      'France': 0, 
      'Allemagne': 0, 
      'Tunisie': 0, 
      'Royaume-Uni': 0,
      'Italie': 0
    },
    { 
      year: '2024', 
      '(unknown)': 52, 
      'France': 15, 
      'Allemagne': 4, 
      'Tunisie': 4, 
      'Royaume-Uni': 5,
      'Italie': 4
    }
  ];
};
