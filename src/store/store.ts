import { configureStore } from '@reduxjs/toolkit';
import { bybitApi } from './api/bybit/bybitApi';
import { tradeRecommendationApi } from './api/tradeRecommendation/tradeRecommendationApi';

export const store = configureStore({
  reducer: {
    [bybitApi.reducerPath]: bybitApi.reducer,
    [tradeRecommendationApi.reducerPath]: tradeRecommendationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat( bybitApi.middleware, tradeRecommendationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 