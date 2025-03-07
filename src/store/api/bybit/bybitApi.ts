import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KlineIntervalV3 } from 'bybit-api';

interface Symbol {
  symbol: string;
  baseCoin: string;
  quoteCoin: string;
  status: string;
}

interface KlineParams {
  symbol: string;
  interval: KlineIntervalV3;
  limit?: number;
}

interface OrderBookParams {
  symbol: string;
  limit?: number;
}

export const bybitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3000/bybit`,
  }),
  reducerPath: 'bybitApi',
  endpoints: (builder) => ({
    // Отримання ціни тікера для конкретного символу
    getTickerPrice: builder.query({
      query: (symbol: string) => `/ticker/${symbol}`,
    }),

    // Отримання ринкових даних
    getMarketData: builder.query({
      query: () => '/market',
    }),

    // Отримання списку ф'ючерсних символів
    getFuturesSymbols: builder.query<Symbol[], void>({
      query: () => '/futures/symbols',
    }),

    // Отримання даних Kline (свічок)
    getKlineData: builder.query({
      query: ({ symbol, interval, limit }: KlineParams) => ({
        url: '/kline',
        params: { symbol, interval, limit },
      }),
    }),

    // Отримання ордербуку
    getOrderBook: builder.query({
      query: ({ symbol, limit }: OrderBookParams) => ({
        url: '/orderbook',
        params: { symbol, limit },
      }),
    }),

    // Отримання детальної інформації про тікери
    getTickers: builder.query({
      query: (symbol?: string) => ({
        url: '/tickers',
        params: symbol ? { symbol } : undefined,
      }),
    }),

    // Отримання відкритого інтересу
    getOpenInterest: builder.query({
      query: (symbol: string) => ({
        url: '/open-interest',
        params: { symbol },
      }),
    }),
  }),
});

export const {
  useGetTickerPriceQuery,
  useGetMarketDataQuery,
  useGetFuturesSymbolsQuery,
  useGetKlineDataQuery,
  useGetOrderBookQuery,
  useGetTickersQuery,
  useGetOpenInterestQuery,
} = bybitApi; 