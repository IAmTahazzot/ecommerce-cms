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
import { DataTableColumnHeader } from "./ProductsTableHeader";
import { Image as ProductImage, Product, Category } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ProductProps extends Product {
  images: ProductImage[];
  category: Category;
}

const Action = ({ row }: { row: any }) => {
  const router = useRouter();

  const deleteProduct = async (productId: number) => {

    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) {
      return;
    }

    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const res = await response.json();

      if (response.ok) {
        toast(res.message);
        router.refresh();
      } else {
        toast(res.message);
      }
    } catch (error) {
      toast((error as Error).message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="curosr-pointer">
          <Link href={`products/${row.original.productId}`}>Edit product</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-rose-500 font-medium"
          onClick={() => {
            deleteProduct(row.original.productId);
          }}
        >
          Delete product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductProps>[] = [
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
    accessorKey: "productId",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {row.original.images.length > 0 && (
            <div className="relative border h-10 w-10 rounded-lg overflow-hidden">
              <Image
                src={"https://utfs.io/f/" + row.original.images[0].imageUrl}
                alt={row.original.title}
                fill
                sizes="100px"
                className="w-10 h-10 rounded-md object-cover"
              />
            </div>
          )}
          <div className="flex flex-col">
            <Link href={`products/${row.original.productId}`}>
              <span className="font-semibold hover:underline">
                {row.original.title}
              </span>
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const icon =
        status.toLocaleLowerCase() === "active" ? (
          <IoMdCheckmarkCircleOutline className="h-4 w-4" />
        ) : (
          <RxCrossCircled className="h-4 w-4" />
        );

      return (
        <div className="flex space-x-2 items-center">
          {icon}
          <span>{row.original.status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <span>{row.original.category.categoryName}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: Action,
  },
];
