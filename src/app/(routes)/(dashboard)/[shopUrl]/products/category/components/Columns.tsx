"use client";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { LuTrash } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/Products/ProductsTableHeader";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { ModalType, useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";

export const Action = ({ row }: { row: any }) => {
  const { openModal } = useModal()
  const router = useRouter()

  const deleteCategory = async (categoryId: number) => {
    try {
      const response = await fetch("/api/category", {
        method: "DELETE", headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast(data.message);
      router.refresh()
    } catch (error) {
      toast((error as Error).message);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuItem onClick={() => {
          openModal(ModalType.EDIT_CATEGORY, row.original)
        }}>
          <FiEdit className="mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          const confirm = window.confirm("Are you sure you want to delete this category?");
          if (confirm) {
            deleteCategory(row.original.categoryId);
          }
        }}>
          <LuTrash className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Name" />
    ),
  },
  {
    accessorKey: "categoryUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category URL" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.createdAt &&
            new Date(row.original.createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.updatedAt &&
            new Date(row.original.updatedAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </span>
      );
    },
  },
  {
    accessorKey: "Action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: Action,
  },
];
