import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'YOUR_API_URL' }),
  endpoints: () => ({
    // Тут будуть ваші endpoints
  }),
}); 