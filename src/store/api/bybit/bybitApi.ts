import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {   FuturesSymbolResponse,
    FuturesTickerResponse,
    KlineQueryParams,
    KlineResponse,
    OrderBookQueryParams,
    OrderBookResponse,
    DetailedTickerResponse,
    OpenInterestResponse,
    TickerQueryParams,
    OpenInterestQueryParams, } from './Interfeces';


export const bybitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3000/bybit/futures`,
  }),
  reducerPath: 'bybitApi',
  endpoints: (builder) => ({
    // Отримання ціни тікера для конкретного символу
    getTickerPrice: builder.query<FuturesTickerResponse, string>({
      query: (symbol) => `/ticker/${symbol}`,
    }),

    // Отримання ринкових даних
    getMarketData: builder.query<FuturesTickerResponse, void>({
      query: () => '/market',
    }),

    // Отримання списку ф'ючерсних символів
    getFuturesSymbols: builder.query<FuturesSymbolResponse[], void>({
      query: () => '/symbols',
    }),

    // Отримання даних Kline (свічок)
    getKlineData: builder.query<KlineResponse, KlineQueryParams>({
      query: ({ symbol, interval, limit }) => ({
        url: '/kline',
        params: { symbol, interval, limit },
      }),
    }),

    // Отримання ордербуку
    getOrderBook: builder.query<OrderBookResponse, OrderBookQueryParams>({
      query: ({ symbol, limit }) => ({
        url: '/orderbook',
        params: { symbol, limit },
      }),
    }),

    // Отримання детальної інформації про тікери
    getTickers: builder.query<DetailedTickerResponse, TickerQueryParams>({
      query: ({ symbol }) => ({
        url: '/tickers',
        params: { symbol },
      }),
    }),

    // Отримання відкритого інтересу
    getOpenInterest: builder.query<OpenInterestResponse, OpenInterestQueryParams>({
      query: ({ symbol, intervalTime }) => ({
        url: '/open-interest',
        params: { symbol, intervalTime },
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

