import { apiSlice } from "@/lib/baseQuery";
import type { ApiResponse } from "@/types";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: ApiResponse<Category[]>) =>
        response.data ?? [],
      providesTags: ["Category"],
    }),
    getCategory: builder.query<ApiResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<
      ApiResponse<Category>,
      { name: string; description?: string }
    >({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string; name?: string; description?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
