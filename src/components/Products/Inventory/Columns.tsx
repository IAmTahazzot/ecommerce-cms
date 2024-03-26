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
} from "@prisma/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type VariantProps = Variant & {
  title: string;
  images: ProductImage[];
  category: Category;
};

const updateInventory = async (inventory: string, variantId: number) => {
  // console.log(inventory, variantId)

  const response = await fetch(`/api/inventory`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inventory, variantId }),
  });

  if (response.ok) {
    toast("Inventory updated");
  } else {
    toast("Error updating inventory");
  }
};

const updatePrice = async (price: string, variantId: number) => {
  const response = await fetch(`/api/inventory/price`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ price, variantId }),
  });

  if (response.ok) {
    toast("Price updated");
  } else {
    toast("Error updating price");
  }
};


export const columns: ColumnDef<VariantProps>[] = [
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
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      let imageUrl = "https://utfs.io/f/";

      if (row.original.imageUrl) {
        imageUrl += row.original.imageUrl;
      } else if (row.original.images.length > 0) {
        imageUrl += row.original.images[0].imageUrl;
      } else {
        imageUrl = "/placeholders/product-placeholder.png";
      }

      return (
        <div className="flex items-center gap-x-2">
          <div className="relative border h-10 w-10 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={row.original.title}
              fill
              sizes="100px"
              className="w-10 h-10 rounded-md object-cover"
            />
          </div>
          <div className="flex flex-col">
            <Link href={`${row.original.productId}`}>
              <span className="font-semibold hover:underline">
                {row.original.title}
              </span>
            </Link>
            <div>
              <span className="text-sm">
                {row.original.color} {row.original.size} {row.original.material}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <Input
          type="number"
          onBlur={(e) => {
            if (Number(e.target.value) === row.original.price) return;
            updatePrice(e.target.value, row.original.variantId);
            console.log(e.target.value);
          }}
          defaultValue={row.original.price}
          className="max-w-[70px]"
        />
      );
    },
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inventory" />
    ),
    cell: ({ row }) => {
      return (
        <Input
          type="number"
          onBlur={(e) => {
            if (Number(e.target.value) === row.original.inventory) return;
            updateInventory(e.target.value, row.original.variantId);
          }}
          defaultValue={row.original.inventory}
          className="max-w-[70px]"
        />
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
];
