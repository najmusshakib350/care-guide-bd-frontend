"use client";

import { useMemo, useState } from "react";
import { doctorColumns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { useGetDoctorsQuery } from "@/redux/api/doctorApi";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddDoctor from "@/components/AddDoctor";

const DoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [hospital, setHospital] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryArgs = useMemo(
    () => ({
      search: search || undefined,
      hospital: hospital || undefined,
      page,
      limit,
    }),
    [search, hospital, page, limit]
  );

  const { data, isFetching, isError } = useGetDoctorsQuery(queryArgs);

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between gap-4">
        <h1 className="font-semibold">All Doctors</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Doctor
            </Button>
          </SheetTrigger>
          <AddDoctor />
        </Sheet>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Input
          placeholder="Filter by hospital..."
          value={hospital}
          onChange={(e) => {
            setPage(1);
            setHospital(e.target.value);
          }}
        />
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-500">
          Failed to load doctors. Please try again.
        </p>
      )}

      <DataTable
        columns={doctorColumns}
        data={data?.data ?? []}
        pageCount={data?.pagination.totalPages ?? 1}
        pageIndex={page - 1}
        pageSize={limit}
        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
        onPageSizeChange={(pageSize) => {
          setLimit(pageSize);
          setPage(1);
        }}
        isLoading={isFetching}
        loadingMessage="Loading doctors..."
        emptyMessage="No doctors found."
      />
    </div>
  );
};

export default DoctorsPage;
