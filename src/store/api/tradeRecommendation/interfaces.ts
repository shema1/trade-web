export interface CreateRecommendationDto {
    symbol: string;
    timeframe: string;
    longProbability: number;
    shortProbability: number;
    recommendation: 'LONG' | 'SHORT' | 'NEUTRAL';
    timestamp: string;
    confidence: number;
    analysis: {
      openInterestTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
      priceAction: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
      volumeAnalysis: 'HIGH' | 'LOW' | 'NORMAL';
      orderBookAnalysis: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    };
  }
  
  export interface AnalyzeSymbolsDto {
    symbols: string[];
  }
  
  export interface RecommendationResponse {
    recommendations: CreateRecommendationDto[];
  }
  
  export interface TaskResponse {
    taskId: string;
  }