
export interface DailyStats {
  date: string;
  views: number;
  interactions: number;
  follows: number;
  linkClicks: number;
  reach: number;
}

export interface AudienceGender {
  gender: string;
  percentage: number;
}

export interface AudienceAge {
  ageGroup: string;
  percentage: number;
}

export interface GeographicData {
  name: string;
  value: number;
}

export interface ContentFormat {
  format: string;
  views: number;
  interactions: number;
}

export interface DashboardData {
  dailyStats: DailyStats[];
  previousYearStats: DailyStats[];
  yoyChanges: {
    views: number;
    interactions: number;
    follows: number;
    linkClicks: number;
    reach: number;
  };
  audienceGender: AudienceGender[];
  audienceAge: AudienceAge[];
  topCountries: GeographicData[];
  topCities: GeographicData[];
  contentFormats: ContentFormat[];
  totalViews: number;
  totalInteractions: number;
  totalFollows: number;
  totalLinkClicks: number;
  totalReach: number;
}