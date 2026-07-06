import { apiSlice } from "@/lib/baseQuery";
import type { DashboardStats } from "@/types";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<
      { success: boolean; data: DashboardStats },
      void
    >({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
