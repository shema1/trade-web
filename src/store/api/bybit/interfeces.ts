/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FuturesTickerListItem {
  symbol: string;
  lastPrice: string;
  indexPrice: string;
  markPrice: string;
  prevPrice24h: string;
  price24hPcnt: string;
  highPrice24h: string;
  lowPrice24h: string;
  prevPrice1h: string;
  openInterest: string;
  openInterestValue: string;
  turnover24h: string;
  volume24h: string;
  fundingRate: string;
  nextFundingTime: string;
  predictedDeliveryPrice: string;
  basisRate: string;
  deliveryFeeRate: string;
  deliveryTime: string;
  ask1Size: string;
  bid1Price: string;
  ask1Price: string;
  bid1Size: string;
  basis: string;
  preOpenPrice: string;
  preQty: string;
  curPreListingPhase: string;
}

export interface FuturesTickerResponse {
  category: string;
  list: FuturesTickerListItem[];
}

export interface LeverageFilter {
  minLeverage: string;
  maxLeverage: string;
  leverageStep: string;
}

export interface PriceFilter {
  minPrice: string;
  maxPrice: string;
  tickSize: string;
}

export interface LotSizeFilter {
  maxOrderQty: string;
  minOrderQty: string;
  qtyStep: string;
  postOnlyMaxOrderQty?: string;
  maxMktOrderQty: string;
  minNotionalValue?: string;
}

export interface RiskParameters {
  priceLimitRatioX: string;
  priceLimitRatioY: string;
}

export interface PriceInfo {
  currentPrice: string;
  prevPrice24h: string;
  priceChange24h: number;
}

export interface FuturesSymbolResponse {
  symbol: string;
  contractType: string;
  status: string;
  baseCoin: string;
  quoteCoin: string;
  launchTime: string;
  deliveryTime?: string;
  deliveryFeeRate?: string;
  priceScale: string;
  leverageFilter: LeverageFilter;
  priceFilter: PriceFilter;
  lotSizeFilter: LotSizeFilter;
  unifiedMarginTrade: boolean;
  fundingInterval: number;
  settleCoin: string;
  copyTrading: string;
  upperFundingRate: string;
  lowerFundingRate: string;
  isPreListing: boolean;
  preListingInfo: any;
  riskParameters: RiskParameters;
  priceInfo: PriceInfo;
}

export interface OrderBookResponse {
  symbol: string;
  timestamp: number;
  bids: Array<[string, string]>; // [ціна, кількість]
  asks: Array<[string, string]>; // [ціна, кількість]
}

export interface DetailedTickerResponse {
  symbol: string;
  lastPrice: string;
  volume24h: string;
  turnover24h: string;
  priceChange24h: number;
  highPrice24h: string;
  lowPrice24h: string;
}

export interface OpenInterestResponse {
  symbol: string;
  timestamp: number;
  openInterest: string;
}

// Додаткові інтерфейси для параметрів запитів
export interface KlineParams {
  symbol: string;
  interval: string;
  limit?: number;
}

export interface OrderBookParams {
  symbol: string;
  limit?: number;
}

// Інтерфейс для даних свічок
export interface KlineDataItem {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type KlineResponse = KlineDataItem[];

// Request interfaces based on backend DTOs
export type KlineIntervalV3 = 
  | '1'
  | '3'
  | '5'
  | '15'
  | '30'
  | '60'
  | '120'
  | '240'
  | '360'
  | '720'
  | 'D'
  | 'W'
  | 'M';

export type OpenInterestIntervalV5 = 
  | '5min'
  | '15min'
  | '30min'
  | '1h'
  | '4h'
  | '1d';

export interface KlineQueryParams {
  /** Торгова пара */
  symbol: string;
  /** Інтервал свічок */
  interval: KlineIntervalV3;
  /** Кількість свічок (1-1000, default: 200) */
  limit?: number;
}

export interface OrderBookQueryParams {
  /** Торгова пара */
  symbol: string;
  /** Глибина книги ордерів (1-500, default: 25) */
  limit?: number;
}

export interface TickerQueryParams {
  /** Торгова пара */
  symbol: string;
}

export interface OpenInterestQueryParams {
  /** Торгова пара */
  symbol: string;
  /** Інтервал часу (default: '5min') */
  intervalTime?: OpenInterestIntervalV5;
}
