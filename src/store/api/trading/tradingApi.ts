import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  TradingTask,
  StartTradingRequest,
  TradingTaskResult,
  TradingTaskResultRequest,
} from './tradingInterface';

// API для роботи з торгівлею
export const tradingApi = createApi({
  reducerPath: 'tradingApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/trading' }),
  endpoints: (builder) => ({
    // Запуск торгівлі
    startTrading: builder.mutation<TradingTask, StartTradingRequest>({
      query: (body) => ({
        url: '/start',
        method: 'POST',
        body,
      }),
    }),

    // Зупинка торгівлі
    stopTrading: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/${taskId}`,
        method: 'DELETE',
      }),
    }),

    // Отримання статусу торгівлі
    getTradingStatus: builder.query<TradingTask, string>({
      query: (taskId) => `/${taskId}`,
    }),

    // Отримання всіх торгових завдань
    getAllTasks: builder.query<TradingTask[], void>({
      query: () => '/',
    }),

    // Отримання результатів торгівлі
    getTradingResult: builder.query<
      TradingTaskResult,
      TradingTaskResultRequest
    >({
      query: ({ taskId, ...params }) => ({
        url: `/${taskId}/result`,
        params,
      }),
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useStartTradingMutation,
  useStopTradingMutation,
  useGetTradingStatusQuery,
  useLazyGetAllTasksQuery,
  useGetAllTasksQuery,
  useGetTradingResultQuery,
} = tradingApi;
