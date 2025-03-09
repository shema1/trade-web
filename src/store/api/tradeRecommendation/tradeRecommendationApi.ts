import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AnalyzeSymbolsDto, CreateRecommendationDto, RecommendationResponse, TaskResponse } from './interfaces';


export const tradeRecommendationApi = createApi({
  reducerPath: 'tradeRecommendationApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/trade-recommendations' }),
  endpoints: (builder) => ({
    getRecommendations: builder.query<RecommendationResponse, void>({
      query: () => '',
    }),
    getRecommendationById: builder.query<CreateRecommendationDto, string>({
      query: (id) => `/${id}`,
    }),
    createRecommendation: builder.mutation<void, CreateRecommendationDto>({
      query: (newRecommendation) => ({
        url: '',
        method: 'POST',
        body: newRecommendation,
      }),
    }),
    deleteRecommendation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    startAnalyzing: builder.mutation<TaskResponse, AnalyzeSymbolsDto>({
      query: (analyzeSymbolsDto) => ({
        url: '/analyze',
        method: 'POST',
        body: analyzeSymbolsDto,
      }),
    }),
    stopAnalyzing: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/analyze/${taskId}`,
        method: 'DELETE',
      }),
    }),
    checkAnalyzingStatus: builder.query<{ isRunning: boolean }, string>({
      query: (taskId) => `/analyze/${taskId}`,
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
  useGetRecommendationByIdQuery,
  useCreateRecommendationMutation,
  useDeleteRecommendationMutation,
  useStartAnalyzingMutation,
  useStopAnalyzingMutation,
  useCheckAnalyzingStatusQuery,
} = tradeRecommendationApi; 