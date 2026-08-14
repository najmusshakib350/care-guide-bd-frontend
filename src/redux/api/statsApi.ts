import { baseApi } from "./baseApi";
import type { ApiSuccessResponse, DashboardStats } from "@/types";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiSuccessResponse<DashboardStats>, void>({
      query: () => "/stats",
      providesTags: [{ type: "Stats", id: "DASHBOARD" }],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = statsApi;
