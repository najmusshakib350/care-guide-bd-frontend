export type ApiSuccessResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type Pagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiSuccessResponse<T[]> & {
  pagination: Pagination;
};

export type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DoctorRef = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
};

export type Patient = {
  _id: string;
  name: string;
  age: number;
  condition: string;
  doctorId: string | DoctorRef;
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateDoctorRequest = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

export type AddPatientRequest = {
  name: string;
  age: number;
  condition: string;
  date: string;
};

export type UpdatePatientRequest = Partial<{
  name: string;
  age: number;
  condition: string;
  date: string;
}>;

export type GetDoctorsParams = {
  search?: string;
  hospital?: string;
  page?: number;
  limit?: number;
};

export type GetPatientsParams = {
  search?: string;
  condition?: string;
  date?: string;
  page?: number;
  limit?: number;
};

export type PatientsPerDoctor = {
  doctorId: string;
  doctorName: string;
  specialization: string;
  patientCount: number;
};

export type PatientRegistration = {
  date: string;
  patientCount: number;
};

export type DashboardStats = {
  overview: {
    totalDoctors: number;
    totalPatients: number;
  };
  patientsPerDoctor: PatientsPerDoctor[];
  patientRegistration: PatientRegistration[];
};
