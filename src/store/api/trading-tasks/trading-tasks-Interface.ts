import { KlineIntervalV3 } from "bybit-api";


export enum TradingTaskStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    STOPPED = 'STOPPED',
    ERROR = 'ERROR',
  }
  

export enum TradingTaskRecommendation {
  BUY = 'BUY',
  SELL = 'SELL',
}


export interface Order {
  symbol: string;
  orderType: string;
  orderLinkId: string;
  slLimitPrice: string;
  orderId: string;
  cancelType: string;
  avgPrice: string;
  stopOrderType: string;
  lastPriceOnCreated: string;
  orderStatus: string;
  createType: string;
  takeProfit: string;
  cumExecValue: string;
  tpslMode: string;
  smpType: string;
  triggerDirection: number;
  blockTradeId: string;
  isLeverage: string;
  rejectReason: string;
  price: string;
  orderIv: string;
  createdTime: string;
  tpTriggerBy: string;
  positionIdx: number;
  timeInForce: string;
  leavesValue: string;
  updatedTime: string;
  side: string;
  smpGroup: number;
  triggerPrice: string;
  tpLimitPrice: string;
  cumExecFee: string;
  leavesQty: string;
  slTriggerBy: string;
  closeOnTrigger: boolean;
  placeType: string;
  cumExecQty: string;
  reduceOnly: boolean;
  qty: string;
  stopLoss: string;
  marketUnit: string;
  smpOrderId: string;
  triggerBy: string;
}

export interface CreateTradingTaskDto {
    timeframe: KlineIntervalV3;
    klinePeriod: number;
    betSize: number;
    stopLoss: number;
    takeProfit: number;
    maxIterations?: number;
    orderLimit?: number;
    keepActive?: boolean;
    testMode?: boolean;
  }
  
  export interface UpdateTradingTaskDto {
    status?: TradingTaskStatus;
    iterationCount?: number;
    symbolsAnalyzed?: number;
    timeframe?: KlineIntervalV3;
    klinePeriod?: number;
    betSize?: number;
    stopLoss?: number;
    takeProfit?: number;
    maxIterations?: number;
    orderLimit?: number;
    keepActive?: boolean;
    testMode?: boolean;
  }

  export interface TradingTaskParams {
    betSize: number;
    timeframe: string;
    klinePeriod: number;
    maxIterations: number;
    keepActive: boolean;
    takeProfit: number;
    stopLoss: number;
    orderLimit: number;
  }


  export interface AnalysisResultSignal {
    name: string;
    value: number;
    interpretation: string;
  }

  export interface StrategyDetails {
    type: string;
    priceChangePercent: number;
    ema9: number;
    ema21: number;
    isGoldenCross: boolean;
    isDeathCross: boolean;
    atrPercent: number;
    adx: number;
    isVolatile: boolean;
    isTrending: boolean;
  }
  export interface AnalysisResult {
    symbol: string;
    strategy: string;
    recommendation: TradingTaskRecommendation
    confidence: number;
    signalConfidence: number;
    currentPrice: number;
    signals: AnalysisResultSignal[];
    timestamp: string;
    strategyDetails: StrategyDetails;
  }
  export interface TradingTaskOrder {
    bybitOrderId: string;
    orderLinkId: string;
    symbol: string;
    analysisResult: AnalysisResult;
    createdAt: string;
    order: Order;
  }

  export interface TradingTaskCompletedOrder extends TradingTaskOrder{
    pnl: number;
    completeDate: string;
  }
  
  export interface AnalysisResultItem  {
    pnl: number;
    symbol: string;
  }
  export interface TradingTask {
    _id: string;
    status: TradingTaskStatus;
    iterationCount: number;
    symbolsAnalyzed: number;
    params: TradingTaskParams;
    createdAt: string;
    orderIds: string[];
    activeOrders: TradingTaskOrder[]
    completedOrders: TradingTaskCompletedOrder[]
    analysisResultsProfit: AnalysisResultItem[]
    analysisResultsLoss: AnalysisResultItem[]
  }
  