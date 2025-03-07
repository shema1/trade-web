import { OrderBookResponse } from '../../store/api/bybit/Interfeces';

interface OrderBookAnalysisResult {
  bullishProbability: number; // Ймовірність росту ціни у відсотках
  bearishProbability: number; // Ймовірність падіння ціни у відсотках
  dominantSide: 'bull' | 'bear' | 'neutral';
  volumeRatio: number; // Співвідношення обсягів buy/sell
  analysis: string; // Текстовий опис аналізу
}

export class OrderBookAnalysis {
  private readonly DEPTH_WEIGHT = 0.7; // Вага для глибини ордербуку
  private readonly VOLUME_WEIGHT = 0.3; // Вага для об'єму

  public analyzeOrderBook(orderBook: OrderBookResponse): OrderBookAnalysisResult {
    // Розрахунок загальних обсягів
    const totalBuyVolume = this.calculateTotalVolume(orderBook.bids);
    const totalSellVolume = this.calculateTotalVolume(orderBook.asks);
    
    // Розрахунок співвідношення buy/sell
    const volumeRatio = totalBuyVolume / totalSellVolume;
    
    // Розрахунок тиску покупців/продавців
    const buyPressure = this.calculatePressure(orderBook.bids);
    const sellPressure = this.calculatePressure(orderBook.asks);
    
    // Розрахунок ймовірностей
    const totalPressure = buyPressure + sellPressure;
    const bullishProbability = (buyPressure / totalPressure) * 100;
    const bearishProbability = (sellPressure / totalPressure) * 100;
    
    // Визначення домінуючої сторони
    const dominantSide = this.getDominantSide(bullishProbability, bearishProbability);
    
    // Формування текстового аналізу
    const analysis = this.generateAnalysis(
      bullishProbability,
      bearishProbability,
      volumeRatio
    );

    return {
      bullishProbability: Number(bullishProbability.toFixed(2)),
      bearishProbability: Number(bearishProbability.toFixed(2)),
      dominantSide,
      volumeRatio: Number(volumeRatio.toFixed(2)),
      analysis
    };
  }

  private calculateTotalVolume(orders: [string, string][]): number {
    return orders.reduce((sum, [_, volume]) => sum + parseFloat(volume), 0);
  }

  private calculatePressure(orders: [string, string][]): number {
    return orders.reduce((pressure, [price, volume], index) => {
      const depth = 1 / (index + 1); // Чим ближче до спреду, тим більша вага
      return pressure + parseFloat(volume) * depth;
    }, 0);
  }

  private getDominantSide(
    bullishProbability: number,
    bearishProbability: number
  ): 'bull' | 'bear' | 'neutral' {
    const difference = Math.abs(bullishProbability - bearishProbability);
    if (difference < 5) return 'neutral';
    return bullishProbability > bearishProbability ? 'bull' : 'bear';
  }

  private generateAnalysis(
    bullishProbability: number,
    bearishProbability: number,
    volumeRatio: number
  ): string {
    let analysis = '';

    if (volumeRatio > 1.2) {
      analysis += 'Значний тиск з боку покупців. ';
    } else if (volumeRatio < 0.8) {
      analysis += 'Значний тиск з боку продавців. ';
    } else {
      analysis += 'Баланс між покупцями та продавцями. ';
    }

    if (bullishProbability > 60) {
      analysis += 'Висока ймовірність росту ціни.';
    } else if (bearishProbability > 60) {
      analysis += 'Висока ймовірність падіння ціни.';
    } else {
      analysis += 'Ринок знаходиться в невизначеному стані.';
    }

    return analysis;
  }
} 