import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateTradingTaskDto, TradingTask, UpdateTradingTaskDto } from './trading-tasks-Interface';

// API для роботи з торгівлею
export const tradingTasksApi = createApi({
  reducerPath: 'tradingTasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/trading-tasks' }),
  tagTypes: ['Tasks', 'Simulations'],
  endpoints: (builder) => ({
    // Отримати всі торгові завдання
    getAllTasks: builder.query<TradingTask[], void>({
      query: () => '',
      providesTags: ['Tasks'],
    }),

    // Отримати одне торгове завдання за ID
    getTaskById: builder.query<TradingTask, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
    }),

    // Створити нове торгове завдання
    createTask: builder.mutation<TradingTask, CreateTradingTaskDto>({
      query: (taskData) => ({
        url: '',
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Оновити торгове завдання
    updateTask: builder.mutation<
      TradingTask,
      { id: string; task: UpdateTradingTaskDto }
    >({
      query: ({ id, task }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Tasks', id }],
    }),

    // Видалити торгове завдання
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
    }),

    // Зупинити торгове завдання
    stopTask: builder.mutation<TradingTask, string>({
      query: (taskId) => ({
        url: `/stop/${taskId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useStopTaskMutation,
} = tradingTasksApi;
