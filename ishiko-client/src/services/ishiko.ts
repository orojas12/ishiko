import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UsernamePassword, Csrf, User } from "@/modules/auth";
import { RootState } from "@/stores/app";

export const ishikoApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const csrf = (getState() as RootState).api.queries[
        "getCsrfToken(undefined)"
      ]?.data as Csrf | undefined;
      if (csrf?.token) {
        headers.set(csrf.headerName, csrf.token);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getCsrfToken: builder.query<Csrf, void>({
      query: () => ({
        url: "/csrf",
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: "/user",
      }),
      providesTags: ["User"],
    }),
    login: builder.mutation<void, UsernamePassword>({
      query: (usernamePassword) => ({
        url: "/login",
        method: "POST",
        body: usernamePassword,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetCsrfTokenQuery, useGetUserQuery, useLoginMutation } =
  ishikoApi;
