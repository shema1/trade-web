import { KlineIntervalV3 } from 'bybit-api';

// Статуси торгового завдання
export enum TradingTaskStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    STOPPED = 'STOPPED',
    ERROR = 'ERROR',
}

// Параметри торгового завдання (відповідає StartTradingRequestDto)
export interface TradingTaskParams {
    symbols: string[];
    timeframe: KlineIntervalV3;
    klinePeriod: number;
    longProbabilityValue: number;
    shortProbabilityValue: number;
    maxIterations: number;
}

// Параметри для запуску аналізу
export interface StartAnalysisTaskRequest {
    symbols: string[];
    timeframe: KlineIntervalV3;
    klinePeriod: number;
    longProbabilityValue: number;
    shortProbabilityValue: number;
    maxIterations: number;
    orderLimit: number;
}

// Параметри для запуску торгівлі
export interface StartTradingTaskRequest extends StartAnalysisTaskRequest {
    betSize: number;
    stopLoss: number;
    takeProfit: number;
}

// Торгове завдання (відповідає TradingTask schema)
export interface TradingTask {
    _id?: string; // MongoDB ID
    taskId: string;
    symbols: string[];
    status: TradingTaskStatus;
    iterationCount: number;
    symbolsAnalyzed: number;
    findOrders: number;
    createdAt: Date;
    completedAt?: Date;
    params?: StartAnalysisTaskRequest | StartTradingTaskRequest;
    error?: string;
}

// Запит на початок торгівлі (відповідає StartTradingRequestDto)
export interface StartTradingRequest {
    symbols: string[];
    timeframe?: KlineIntervalV3;
    klinePeriod?: number;
    longProbabilityValue?: number;
    shortProbabilityValue?: number;
    maxIterations?: number;
}

// Запит на отримання результатів торгівлі (відповідає TradingTaskResultRequestDto)
export interface TradingTaskResultRequest {
    taskId: string;
    takeProfit: number;
    stopLoss: number;
    interval: KlineIntervalV3;
    betSize?: number;
}

// Результат торгової операції (відповідає структурі з CheckProfitableResponseDto)
export interface TradeResult {
    symbol: string;
    entryPrice: number;
    profitPrice: number;
    lossPrice: number;
    entryTime: string;
    executionTime: string;
    recommendation: 'LONG' | 'SHORT';
    betSize: number;
    profit: number;
    lost: number;
    type: 'OPEN' | 'LOST' | 'PROFIT';
}

// Загальна статистика результатів (відповідає структурі з CheckProfitableResponseDto)
export interface TradingStatistics {
    totalTrades: number;
    profitableTrades: number;
    lossTrades: number;
    winRate: number;
    totalProfit: number;
    averageProfit: number;
    maxDrawdown: number;
    profitFactor: number;
    sharpeRatio?: number;
    maxConsecutiveLosses?: number;
    maxConsecutiveWins?: number;
}

// Запит на симуляцію торгівлі
export interface TradingTaskSimulationRequest {
    taskId: string;
    takeProfit: number;
    stopLoss: number;
    interval: KlineIntervalV3;
    betSize?: number;
}

// Деталі прибуткової угоди
export interface ProfitableDetail {
    symbol: string;
    entryPrice: number;
    profitPrice: number;
    lossPrice: number;
    entryTime: string;
    executionTime: string;
    recommendation: 'LONG' | 'SHORT';
}

// Розширюємо TradingTaskResult
export interface TradingTaskResult {
    _id?: string;
    taskId: string;
    result: {
        taskId: string;
        totalOrdersCount: number;
        profitableOrdersCount: number;
        unprofitableOrdersCount: number;
        successRate: number;
        lost: number;
        profit: number;
        potentialProfitValue: number;
        potentialLossValue: number;
        profitableSymbols: string[];
        unprofitableSymbols: string[];
        profitableDetails: TradeResult[];
        unprofitableDetails: TradeResult[];
        openPositionsCount: number;
        openPositionsSymbols: string[];
        openPositionsDetails: TradeResult[];
    },
    simulationParams: {
        betSize: number;
        interval: KlineIntervalV3;
        stopLoss: number;
        takeProfit: number;
        taskId: string;
    }
}

// Додаткові типи для внутрішнього використання
export interface RunTradingProcessRequest {
    symbols: string[];
    taskId: string;
    taskDocId: string;
    timeframe?: KlineIntervalV3;
    klinePeriod?: number;
    longProbabilityValue?: number;
    shortProbabilityValue?: number;
    maxIterations?: number;
}
