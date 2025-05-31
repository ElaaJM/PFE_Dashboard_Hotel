
import { Review } from '../../types/review-types';
import { sentimentByYear } from './sentiment-utils';
import { reviewTotalsByYear } from './review-metrics';

// Generate mock reviews based on real distribution
export const generateMockReviewData = (): Review[] => {
  const currentYear = new Date().getFullYear();
  const totalReviews = reviewTotalsByYear[currentYear as keyof typeof reviewTotalsByYear] || 94;
  const posCount = sentimentByYear[currentYear as keyof typeof sentimentByYear]?.Positive || 44;
  const neutCount = sentimentByYear[currentYear as keyof typeof sentimentByYear]?.Neutral || 35;
  const negCount = sentimentByYear[currentYear as keyof typeof sentimentByYear]?.Negative || 15;
  
  // Mock sources with actual country data from the images
  const sources = ['Booking.com', 'TripAdvisor', 'Google', 'Facebook'];
  const countries = ['France', 'Tunisia', 'Germany', 'Italy', 'UK', 'Spain', 'Canada', 'Romania', 'Lebanon', 'Greece', 'Indonesia'];
  const stayTypes = ['Leisure', 'Business', 'Family', 'Other'];
  const rooms = ['Standard', 'Deluxe', 'Suite', 'Villa'];

  // Score distribution from image 11
  const scoreDistribution2024 = {
    1: 1, 2: 3, 3: 1, 4: 6, 5: 3, 6: 23, 7: 8, 8: 34, 9: 4, 10: 11
  };

  const generateReviews = (count: number, sentiment: 'Positive' | 'Neutral' | 'Negative'): Review[] => {
    const result: Review[] = [];
    const now = new Date();
    const scoreRange = sentiment === 'Positive' ? {min: 8, max: 10} :
                       sentiment === 'Neutral' ? {min: 5, max: 7} :
                                               {min: 1, max: 4};
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(now.getDate() - Math.floor(Math.random() * 180)); // last 6 months
      
      result.push({
        id: result.length + 1,
        date: date.toISOString().split('T')[0],
        name: `Guest ${result.length + 1}`,
        comment: `This is a ${sentiment.toLowerCase()} review comment.`,
        score: Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1) + scoreRange.min),
        maxRating: 10,
        sentiment: sentiment,
        source: sources[Math.floor(Math.random() * sources.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        typeOfStay: stayTypes[Math.floor(Math.random() * stayTypes.length)],
        room: rooms[Math.floor(Math.random() * rooms.length)],
        duration: Math.floor(Math.random() * 10) + 1,
      });
    }
    
    return result;
  };
  
  return [
    ...generateReviews(posCount, 'Positive'),
    ...generateReviews(neutCount, 'Neutral'),
    ...generateReviews(negCount, 'Negative')
  ];
};

export const mockReviewData: Review[] = generateMockReviewData();
