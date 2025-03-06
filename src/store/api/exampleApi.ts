import { api } from '../api';

export const exampleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => 'endpoint',
    }),
    postData: builder.mutation({
      query: (body) => ({
        url: 'endpoint',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetDataQuery, usePostDataMutation } = exampleApi; 