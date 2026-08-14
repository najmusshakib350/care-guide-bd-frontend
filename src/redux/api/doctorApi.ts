import { baseApi } from "./baseApi";
import type {
  AddPatientRequest,
  ApiSuccessResponse,
  CreateDoctorRequest,
  Doctor,
  GetDoctorsParams,
  PaginatedResponse,
  Patient,
} from "@/types";

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<PaginatedResponse<Doctor>, GetDoctorsParams | void>({
      query: (params) => ({
        url: "/doctors",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Doctor" as const,
                id: _id,
              })),
              { type: "Doctor", id: "LIST" },
            ]
          : [{ type: "Doctor", id: "LIST" }],
    }),

    createDoctor: builder.mutation<
      ApiSuccessResponse<Doctor>,
      CreateDoctorRequest
    >({
      query: (body) => ({
        url: "/doctors",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Doctor", id: "LIST" },
        { type: "Stats", id: "DASHBOARD" },
      ],
    }),

    getDoctorPatients: builder.query<ApiSuccessResponse<Patient[]>, string>({
      query: (doctorId) => `/doctors/${doctorId}/patients`,
      providesTags: (_result, _error, doctorId) => [
        { type: "Patient", id: `DOCTOR-${doctorId}` },
      ],
    }),

    addPatientToDoctor: builder.mutation<
      ApiSuccessResponse<Patient>,
      { doctorId: string; body: AddPatientRequest }
    >({
      query: ({ doctorId, body }) => ({
        url: `/doctors/${doctorId}/patients`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { doctorId }) => [
        { type: "Doctor", id: "LIST" },
        { type: "Doctor", id: doctorId },
        { type: "Patient", id: "LIST" },
        { type: "Patient", id: `DOCTOR-${doctorId}` },
        { type: "Stats", id: "DASHBOARD" },
      ],
    }),

    deletePatientFromDoctor: builder.mutation<
      ApiSuccessResponse<null>,
      { doctorId: string; patientId: string }
    >({
      query: ({ doctorId, patientId }) => ({
        url: `/doctors/${doctorId}/patients/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { doctorId }) => [
        { type: "Doctor", id: "LIST" },
        { type: "Doctor", id: doctorId },
        { type: "Patient", id: "LIST" },
        { type: "Patient", id: `DOCTOR-${doctorId}` },
        { type: "Stats", id: "DASHBOARD" },
      ],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useCreateDoctorMutation,
  useGetDoctorPatientsQuery,
  useAddPatientToDoctorMutation,
  useDeletePatientFromDoctorMutation,
} = doctorApi;
