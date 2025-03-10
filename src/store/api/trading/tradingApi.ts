import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  TradingTask,
  StartTradingRequest,
  TradingTaskResult,
  TradingTaskSimulationRequest,
} from './tradingInterface';

// API для роботи з торгівлею
export const tradingApi = createApi({
  reducerPath: 'tradingApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/trading' }),
  tagTypes: ['Tasks', 'Simulations'],
  endpoints: (builder) => ({
    // Запуск торгівлі
    startAnalysis: builder.mutation<TradingTask, StartTradingRequest>({
      query: (body) => ({
        url: '/start-analysis',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Зупинка торгівлі
    stopAnalysis: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Отримання всіх торгових завдань
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

    // Отримання списку симуляцій для завдання
    getTradeSimulationList: builder.query<TradingTaskResult[], string>({
      query: (taskId) => `/${taskId}/profitlist`,
      providesTags: ['Simulations'],
    }),

    // Отримання конкретної симуляції за ID
    getTradeSimulationById: builder.query<TradingTaskResult, string>({
      query: (id) => `/simulation/${id}`,
      providesTags: ['Simulations'],
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useStartAnalysisMutation,
  useStopAnalysisMutation,
  useLazyGetAllTasksQuery,
  useGetAllTasksQuery,
  useTradingSimulationMutation,
  useGetTradeSimulationListQuery,
  useLazyGetTradeSimulationListQuery,
  useGetTradeSimulationByIdQuery,
  useLazyGetTradeSimulationByIdQuery,
} = tradingApi;
