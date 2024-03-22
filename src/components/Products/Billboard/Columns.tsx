"use client";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

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
import { DataTableColumnHeader } from "../ProductsTableHeader";
import {
  Image as ProductImage,
  Product,
  Category,
  Variant,
  BillBoard,
} from "@prisma/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export type BillboardProps = BillBoard & {
  category: Category;
};

export const Actions = ({ row }: { row: any }) => {
  const router = useRouter();
  const pathName = usePathname()

  const editUrl = '/' + pathName.split('/')[1] + '/billboard/'

  const deleteBillboard = async (billboardId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this billboard?");
    if (!confirm) return;

    try {
      const response = await fetch("/api/billboard", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billboardId }),
      });

      if (response.ok) {
        toast.success("Billboard deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete billboard");
      }
    } catch (error) {
      toast.error("Failed to delete billboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuItem onSelect={() => router.push(`${editUrl}${row.original.id}`)}>
          <DropdownMenuLabel>Edit</DropdownMenuLabel>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            deleteBillboard(row.original.id as number);
          }}
        >
          <DropdownMenuLabel>Delete</DropdownMenuLabel>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BillboardProps>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billboard" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <div className="relative border h-10 w-10 rounded-lg overflow-hidden">
            <Image
              src={"https://utfs.io/f/" + row.original.imageUrl}
              alt={row.original.title}
              fill
              sizes="100px"
              className="w-10 h-10 rounded-md object-cover"
            />
          </div>
          <div className="flex flex-col">
            <Link href={`${row.original.id}`}>
              <span className="font-semibold hover:underline">
                {row.original.title}
              </span>
            </Link>
            <span className="text-xs text-neutral-400">
              {row.original.subtitle}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category.categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-neutral-400">
        {new Date(row.original.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: Actions,
  },
];
