import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Log } from './logs-interface';

// API для роботи з логами
export const logsApi = createApi({
  reducerPath: 'logsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/logs' }),
  tagTypes: ['Logs'],
  endpoints: (builder) => ({
    // Отримати всі логи
    getAllLogs: builder.query<Log[], void>({
      query: () => '',
      providesTags: ['Logs'],
    }),

    // Отримати логи для конкретного завдання
    getTaskLogs: builder.query<Log[], string>({
      query: (taskId) => `/${taskId}`,
      providesTags: (_result, _error, taskId) => [{ type: 'Logs', id: taskId }],
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useGetAllLogsQuery,
  useGetTaskLogsQuery,
} = logsApi;
