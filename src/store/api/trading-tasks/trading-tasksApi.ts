import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateTradingTaskDto, TradingTask, UpdateTradingTaskDto } from './trading-tasks-Interface';

// API для роботи з торгівлею
export const tradingTasksApi = createApi({
  reducerPath: 'tradingTasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/trading-tasks' }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    // Отримати всі торгові завдання
    getAllTasks: builder.query<TradingTask[], void>({
      query: () => '',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tasks' as const, id: _id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),

    // Отримати одне торгове завдання за ID
    getTaskById: builder.query<TradingTask, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTask } = await queryFulfilled;
          dispatch(
            tradingTasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
              const index = draft.findIndex(task => task._id === id);
              if (index !== -1) {
                draft[index] = updatedTask;
              }
            })
          );
        } catch {
          // Якщо запит не вдався, нічого не робимо
        }
      }
    }),

    // Створити нове торгове завдання
    createTask: builder.mutation<TradingTask, CreateTradingTaskDto>({
      query: (taskData) => ({
        url: '',
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: 'LIST' }
      ],
    }),

    // Видалити торгове завдання
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: 'LIST' }
      ],
    }),

    // Зупинити торгове завдання
    stopTask: builder.mutation<TradingTask, string>({
      query: (taskId) => ({
        url: `/stop/${taskId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Tasks', id },
        { type: 'Tasks', id: 'LIST' }
      ],
    }),
  }),
});

// Експорт хуків для використання в компонентах
export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useStopTaskMutation,
} = tradingTasksApi;
