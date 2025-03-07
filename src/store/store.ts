import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { bybitApi } from './api/bybit/bybitApi';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [bybitApi.reducerPath]: bybitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, bybitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 