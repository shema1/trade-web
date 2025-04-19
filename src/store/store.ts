import { configureStore } from '@reduxjs/toolkit';
import { bybitApi } from './api/bybit/bybitApi';
import { tradeRecommendationApi } from './api/tradeRecommendation/tradeRecommendationApi';
import { tradingApi } from './api/trading/tradingApi';  
import { tradingTasksApi } from './api/trading-tasks/trading-tasksApi';
import { logsApi } from './api/logs-data/logsApi';
export const store = configureStore({
  reducer: {
    [bybitApi.reducerPath]: bybitApi.reducer,
    [tradeRecommendationApi.reducerPath]: tradeRecommendationApi.reducer,
    [tradingApi.reducerPath]: tradingApi.reducer,
    [tradingTasksApi.reducerPath]: tradingTasksApi.reducer,
    [logsApi.reducerPath]: logsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat( bybitApi.middleware, tradeRecommendationApi.middleware, tradingApi.middleware, tradingTasksApi.middleware, logsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 