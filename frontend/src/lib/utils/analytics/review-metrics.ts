
// Actual data from the provided values
export const reviewTotalsByYear = {
  2022: 26,
  2023: 36,
  2024: 94
};

export const reviewScoresByYear = {
  2022: 6.580,
  2023: 7.060,
  2024: 7.030
};

// Process review score by year
export const calculateReviewScoreByYear = (): any[] => {
  return [
    { year: '2022', avgScore: 6.580, margin: 0 },
    { year: '2023', avgScore: 7.060, margin: 7.300 },
    { year: '2024', avgScore: 7.030, margin: -0.400 }
  ];
};

// Process reviews per year
export const calculateReviewsPerYear = (): any[] => {
  return [
    { year: '2022', reviews: 26, margin: 0 },
    { year: '2023', reviews: 36, margin: 38.500 },
    { year: '2024', reviews: 94, margin: 161.100 }
  ];
};

// Source data by year
export const reviewsBySourceAndYear = [
  { year: '2022', unknown: 10, Google: 16, Tripadvisor: 0, Total: 26 },
  { year: '2023', unknown: 0, Google: 33, Tripadvisor: 3, Total: 36 },
  { year: '2024', unknown: 42, Google: 43, Tripadvisor: 9, Total: 94 }
];

// Review score distribution data
export const reviewScoreDistributionData = {
  2022: [
    { score: 1, count: 1 },
    { score: 4, count: 2 },
    { score: 6, count: 13 },
    { score: 7, count: 2 },
    { score: 8, count: 5 },
    { score: 10, count: 3 }
  ],
  2023: [
    { score: 2, count: 1 },
    { score: 4, count: 3 },
    { score: 6, count: 11 },
    { score: 8, count: 18 },
    { score: 10, count: 3 }
  ],
  2024: [
    { score: 1, count: 1 },
    { score: 2, count: 3 },
    { score: 3, count: 1 },
    { score: 4, count: 6 },
    { score: 5, count: 3 },
    { score: 6, count: 23 },
    { score: 7, count: 8 },
    { score: 8, count: 34 },
    { score: 9, count: 4 },
    { score: 10, count: 11 }
  ]
};
