"use client";

import { useMemo, useState } from "react";
import { createPatientColumns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import {
  useDeletePatientMutation,
  useGetPatientsQuery,
} from "@/redux/api/patientApi";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddPatient from "@/components/AddPatient";
import EditPatient from "@/components/EditPatient";
import type { Patient } from "@/types";

const PatientsPage = () => {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const queryArgs = useMemo(
    () => ({
      search: search || undefined,
      condition: condition || undefined,
      date: date || undefined,
      page,
      limit,
    }),
    [search, condition, date, page, limit]
  );

  const { data, isFetching, isError } = useGetPatientsQuery(queryArgs);
  const [deletePatient] = useDeletePatientMutation();

  const handleDelete = async (patientId: string) => {
    const confirmed = window.confirm("Delete this patient?");
    if (!confirmed) return;
    await deletePatient(patientId);
  };

  const handleBulkDelete = async (rows: Patient[]) => {
    const confirmed = window.confirm(
      `Delete ${rows.length} selected patient(s)?`
    );
    if (!confirmed) return;
    await Promise.all(rows.map((row) => deletePatient(row._id)));
  };

  const columns = useMemo(
    () =>
      createPatientColumns({
        onEdit: setEditingPatient,
        onDelete: handleDelete,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between gap-4">
        <h1 className="font-semibold">All Patients</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </SheetTrigger>
          <AddPatient />
        </Sheet>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Input
          placeholder="Filter by condition..."
          value={condition}
          onChange={(e) => {
            setPage(1);
            setCondition(e.target.value);
          }}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            setPage(1);
            setDate(e.target.value);
          }}
        />
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-500">
          Failed to load patients. Please try again.
        </p>
      )}

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pageCount={data?.pagination.totalPages ?? 1}
        pageIndex={page - 1}
        pageSize={limit}
        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
        onPageSizeChange={(pageSize) => {
          setLimit(pageSize);
          setPage(1);
        }}
        onBulkDelete={handleBulkDelete}
        bulkDeleteLabel="Delete Patient(s)"
        isLoading={isFetching}
        loadingMessage="Loading patients..."
        emptyMessage="No patients found."
      />

      <Sheet
        open={!!editingPatient}
        onOpenChange={(open) => {
          if (!open) setEditingPatient(null);
        }}
      >
        {editingPatient && (
          <EditPatient
            patient={editingPatient}
            onUpdated={() => setEditingPatient(null)}
          />
        )}
      </Sheet>
    </div>
  );
};

export default PatientsPage;
