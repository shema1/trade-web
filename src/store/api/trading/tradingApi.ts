import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  TradingTask,
  StartAnalysisTaskRequest,
  StartTradingTaskRequest,
  TradingTaskResult,
  TradingTaskSimulationRequest,
} from './tradingInterface';

// API для роботи з торгівлею
export const tradingApi = createApi({
  reducerPath: 'tradingApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/trading' }),
  tagTypes: ['Tasks', 'Simulations'],
  endpoints: (builder) => ({
    // Запуск аналізу
    startAnalysis: builder.mutation<TradingTask, StartAnalysisTaskRequest>({
      query: (body) => ({
        url: '/start-analysis',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Запуск торгівлі
    startTrading: builder.mutation<TradingTask, StartTradingTaskRequest>({
      query: (body) => ({
        url: '/start-trading',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Зупинка завдання
    stopTask: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Отримання всіх завдань
    getAllTasks: builder.query<TradingTask[], void>({
      query: () => '/',
      providesTags: ['Tasks'],
    }),

    // Симуляція торгівлі
    tradingSimulation: builder.mutation<TradingTaskResult, TradingTaskSimulationRequest>({
      query: ({ taskId, ...params }) => ({
        url: `/${taskId}/check-profit`,
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Simulations'],
    }),

    // Отримання списку симуляцій
    getTradeSimulationList: builder.query<TradingTaskResult[], string>({
      query: (taskId) => `/${taskId}/profitlist`,
      providesTags: ['Simulations'],
    }),

    // Отримання деталей симуляції
    getTradeSimulationById: builder.query<TradingTaskResult, string>({
      query: (id) => `/profit/${id}`,
      providesTags: ['Simulations'],
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useStartAnalysisMutation,
  useStartTradingMutation,
  useStopTaskMutation,
  useGetAllTasksQuery,
  useLazyGetAllTasksQuery,
  useTradingSimulationMutation,
  useGetTradeSimulationListQuery,
  useLazyGetTradeSimulationListQuery,
  useGetTradeSimulationByIdQuery,
  useLazyGetTradeSimulationByIdQuery,
} = tradingApi;
