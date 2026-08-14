import { baseApi } from "./baseApi";
import type {
  ApiSuccessResponse,
  GetPatientsParams,
  PaginatedResponse,
  Patient,
  UpdatePatientRequest,
} from "@/types";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<
      PaginatedResponse<Patient>,
      GetPatientsParams | void
    >({
      query: (params) => ({
        url: "/patients",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Patient" as const,
                id: _id,
              })),
              { type: "Patient", id: "LIST" },
            ]
          : [{ type: "Patient", id: "LIST" }],
    }),

    updatePatient: builder.mutation<
      ApiSuccessResponse<Patient>,
      { patientId: string; body: UpdatePatientRequest }
    >({
      query: ({ patientId, body }) => ({
        url: `/patients/${patientId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { patientId }) => [
        { type: "Patient", id: patientId },
        { type: "Patient", id: "LIST" },
        { type: "Stats", id: "DASHBOARD" },
      ],
    }),

    deletePatient: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (patientId) => ({
        url: `/patients/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, patientId) => [
        { type: "Patient", id: patientId },
        { type: "Patient", id: "LIST" },
        { type: "Doctor", id: "LIST" },
        { type: "Stats", id: "DASHBOARD" },
      ],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;
