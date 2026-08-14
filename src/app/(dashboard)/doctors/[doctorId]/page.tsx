"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createDoctorPatientColumns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useAlert } from "@/components/ui/alerts/Alert";
import {
  useDeletePatientFromDoctorMutation,
  useGetDoctorPatientsQuery,
} from "@/redux/api/doctorApi";
import { getApiErrorMessage } from "@/utils/error";
import type { Patient } from "@/types";

const DoctorPatientsContent = () => {
  const params = useParams<{ doctorId: string }>();
  const searchParams = useSearchParams();
  const doctorId = params.doctorId;
  const doctorName = searchParams.get("name");

  const { showSuccess, showError } = useAlert();
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const {
    data,
    isFetching,
    isError,
    error,
  } = useGetDoctorPatientsQuery(doctorId, {
    skip: !doctorId,
  });

  const [deletePatientFromDoctor, { isLoading: isDeleting }] =
    useDeletePatientFromDoctorMutation();

  const patients = data?.data ?? [];

  const columns = useMemo(
    () =>
      createDoctorPatientColumns({
        onDelete: setPatientToDelete,
        isDeleting,
      }),
    [isDeleting]
  );

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      const result = await deletePatientFromDoctor({
        doctorId,
        patientId: patientToDelete._id,
      }).unwrap();

      showSuccess(
        result.message ?? "Patient deleted successfully."
      );
      setPatientToDelete(null);
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to delete patient"));
    }
  };

  const errorMessage = isError
    ? getApiErrorMessage(error, "Failed to load patients for this doctor.")
    : null;

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/doctors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold">
              {doctorName ? `${doctorName}'s Patients` : "Doctor Patients"}
            </h1>
            {doctorName && (
              <p className="text-sm text-muted-foreground">
                View and manage patients assigned to this doctor.
              </p>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
      )}

      <DataTable
        columns={columns}
        data={patients}
        pageCount={1}
        pageIndex={0}
        pageSize={Math.max(patients.length, 10)}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        isLoading={isFetching}
        loadingMessage="Loading patients..."
        emptyMessage="No patients found for this doctor."
      />

      <ConfirmDeleteDialog
        open={!!patientToDelete}
        onOpenChange={(open) => {
          if (!open) setPatientToDelete(null);
        }}
        description="Are you sure you want to remove this patient from this doctor?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

const DoctorPatientsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8 text-sm text-muted-foreground">
          Loading patients...
        </div>
      }
    >
      <DoctorPatientsContent />
    </Suspense>
  );
};

export default DoctorPatientsPage;
