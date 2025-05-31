
export interface Review {
    id: number;
    date: string;
    name: string;
    comment: string;
    score: number;
    maxRating: number;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    source: string;
    country: string;
    typeOfStay: string;
    room: string;
    duration: number;
  }
  
  export interface SentimentData {
    name: string;
    value: number;
  }
  
  export interface SourceData {
    name: string;
    value: number;
  }
  
  export interface AvgScoreBySource {
    source: string;
    avgScore: number;
  }
  
  export interface TypeOfStayData {
    name: string;
    value: number;
  }
  
  export interface ReviewAnalyticsData {
    sentimentData: SentimentData[];
    sourceData: SourceData[];
    avgScoreBySource: AvgScoreBySource[];
    typeOfStayData: TypeOfStayData[];
    reviewsByCountry: any[];
    reviewScoreByYear: any[];
    reviewsPerYear: any[];
    sentimentByYearData: any[];
  }