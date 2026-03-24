import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || `http://localhost:5000/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Jobs', 'Applications'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Jobs endpoints
    getJobs: builder.query({
      query: (params) => ({
        url: '/jobs',
        params, // Automatically appends ?company=...&location=...
      }),
      providesTags: ['Jobs'],
    }),
    createJob: builder.mutation({
      query: (newJob) => ({
        url: '/jobs',
        method: 'POST',
        body: newJob,
      }),
      invalidatesTags: ['Jobs'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/jobs/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Jobs'],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Jobs'],
    }),
    
    // Applications endpoints
    applyToJob: builder.mutation({
      query: (jobId) => ({
        url: `/applications/jobs/${jobId}/apply`,
        method: 'POST',
      }),
      invalidatesTags: ['Applications'],
    }),
    getAppliedJobs: builder.query({
      query: () => '/applications',
      providesTags: ['Applications'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation,
  useGetAppliedJobsQuery,
} = apiSlice;
