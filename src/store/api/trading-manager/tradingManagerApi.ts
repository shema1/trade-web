import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TradingTaskStatus } from '../trading-tasks/trading-tasks-Interface';
import { CheckCompletedOrdersParams, OrdersAnalysisResult } from './trading-manager-interface';

// API для роботи з торговим менеджером
export const tradingManagerApi = createApi({
  reducerPath: 'tradingManagerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/trading-manager' }),
  tagTypes: ['TradingManager'],
  endpoints: (builder) => ({
    // Перевірка статусу ордерів завдання
    checkTaskOrdersOnComplete: builder.mutation<TradingTaskStatus, string>({
      query: (taskId) => ({
        url: `/check-task-orders-on-complete/${taskId}`,
        method: 'POST',
      }),
    }),

    // Перевірка завершених ордерів з даними Kline
    checkCompletedOrdersWithKlineData: builder.mutation<
      OrdersAnalysisResult,
      { taskId: string } & CheckCompletedOrdersParams
    >({
      query: ({ taskId, ...body }) => ({
        url: `/check-completed-orders-with-kline-data/${taskId}`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useCheckTaskOrdersOnCompleteMutation,
  useCheckCompletedOrdersWithKlineDataMutation,
} = tradingManagerApi;
