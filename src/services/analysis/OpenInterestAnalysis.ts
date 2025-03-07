import { OpenInterestResponse, DetailedTickerResponse, KlineResponse, OpenInterestIntervalV5 } from '../../store/api/bybit/Interfeces';

export interface OpenInterestAnalysisResult {
  bullishProbability: number;    // Шанс росту ціни (0-100%)
  bearishProbability: number;    // Шанс падіння ціни (0-100%)
  confidence: number;            // Рівень впевненості в прогнозі (0-100%)
  analysis: string;              // Текстовий опис аналізу
  forecastTime: {
    minutes: number;            // На скільки хвилин прогноз
    startTime: Date;           // Час початку прогнозу
    endTime: Date;            // Час кінця прогнозу
  };
}

export class OpenInterestAnalysis {
  /**
   * Аналізує дані Open Interest та повертає прогноз руху ціни
   * @param openInterest - Дані Open Interest
   * @param ticker - Дані тікера
   * @param klineData - Дані свічок
   * @param forecastMinutes - На скільки хвилин робити прогноз
   */
  public static analyze(
    openInterest: OpenInterestResponse,
    ticker: DetailedTickerResponse,
    klineData: KlineResponse,
    forecastMinutes: number
  ): OpenInterestAnalysisResult {
    const oiList = openInterest.list;
    if (oiList.length < 2) {
      return this.createBaseResult("Недостатньо даних для аналізу", 50, forecastMinutes);
    }

    // Розрахунок змін OI
    const latestOI = Number(oiList[oiList.length - 1].openInterest);
    const previousOI = Number(oiList[oiList.length - 2].openInterest);
    const oiChangePercent = ((latestOI - previousOI) / previousOI) * 100;

    // Розрахунок зміни ціни
    const priceChange = ticker.priceChange24h;

    // Базовий аналіз
    let bullish = 50;
    let confidence = 60;
    let analysis = '';

    // Коригування впевненості на основі часу прогнозу
    const confidenceAdjustment = this.getConfidenceAdjustment(forecastMinutes);
    
    // Основний аналіз
    if (oiChangePercent > 0) {
      if (priceChange > 0) {
        bullish = 70 + Math.min(oiChangePercent, 20);
        confidence = 80;
        analysis = 'Сильний бичачий тренд: Зростання Open Interest разом з ціною';
      } else {
        bullish = 35 - Math.min(Math.abs(oiChangePercent), 15);
        confidence = 75;
        analysis = 'Ведмежий тренд: Зростання Open Interest при падінні ціни';
      }
    } else {
      if (priceChange < 0) {
        bullish = 55 + Math.min(Math.abs(oiChangePercent), 15);
        confidence = 65;
        analysis = 'Можливий розворот: Падіння Open Interest та ціни';
      } else {
        bullish = 45;
        confidence = 50;
        analysis = 'Слабкий тренд: Падіння Open Interest при зростанні ціни';
      }
    }

    // Коригуємо впевненість залежно від часу прогнозу
    confidence = Math.max(20, confidence - confidenceAdjustment);

    // Додатковий аналіз на основі свічок
    if (klineData.length > 0) {
      const recentCandles = klineData.slice(-3);
      const volumeIncreasing = recentCandles[2].volume > recentCandles[0].volume;
      
      if (volumeIncreasing && bullish > 50) {
        confidence += 10;
        analysis += '\nЗростаючий об\'єм підтверджує тренд';
      }
    }

    // Додаткові фактори
    if (Math.abs(oiChangePercent) > 10) {
      confidence += 10;
      analysis += '\nЗначна зміна Open Interest підвищує надійність сигналу';
    }

    // Додаємо інформацію про час прогнозу
    const now = new Date();
    const endTime = new Date(now.getTime() + forecastMinutes * 60000);

    analysis += `\nПрогноз на наступні ${forecastMinutes} хвилин`;

    return {
      bullishProbability: Math.round(bullish),
      bearishProbability: Math.round(100 - bullish),
      confidence: Math.min(100, Math.round(confidence)),
      analysis,
      forecastTime: {
        minutes: forecastMinutes,
        startTime: now,
        endTime
      }
    };
  }

  /**
   * Розраховує зниження впевненості залежно від часу прогнозу
   */
  private static getConfidenceAdjustment(minutes: number): number {
    // Чим довший прогноз, тим нижча впевненість
    if (minutes <= 5) return 0;
    if (minutes <= 15) return 10;
    if (minutes <= 30) return 20;
    return 30; // Максимальне зниження впевненості
  }

  private static createBaseResult(
    analysis: string,
    probability: number,
    forecastMinutes: number
  ): OpenInterestAnalysisResult {
    const now = new Date();
    const endTime = new Date(now.getTime() + forecastMinutes * 60000);

    return {
      bullishProbability: probability,
      bearishProbability: 100 - probability,
      confidence: 0,
      analysis,
      forecastTime: {
        minutes: forecastMinutes,
        startTime: now,
        endTime
      }
    };
  }

  // Додаємо мапінг часу прогнозу до інтервалу Open Interest
  public static getForecastInterval(minutes: number): OpenInterestIntervalV5 {
    if (minutes <= 5) return '5min';
    if (minutes <= 15) return '15min';
    if (minutes <= 30) return '30min';
    if (minutes <= 60) return '1h';
    if (minutes <= 240) return '4h';
    return '1d';
  }
} 