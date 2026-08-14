"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import type { Patient } from "@/types";
import { formatDate } from "@/utils/patient";

type ColumnsOptions = {
  onDelete: (patient: Patient) => void;
  isDeleting?: boolean;
};

export const createDoctorPatientColumns = ({
  onDelete,
  isDeleting,
}: ColumnsOptions): ColumnDef<Patient>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Age
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          disabled={isDeleting}
          onClick={() => onDelete(patient)}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      );
    },
  },
];
