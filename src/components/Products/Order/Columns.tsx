'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '../ProductsTableHeader'
import { Order, User, OrderItem, Product } from '@prisma/client'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export type EnhancedOrder = Order & {
  user: User
  orderItems: (OrderItem & { product: Product })[]
}

export const Actions = ({ row }: { row: any }) => {
  const router = useRouter()

  const deleteOrder = async (orderId: number) => {
    try {
      const response = await fetch('/api/order', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      if (response.ok) {
        toast.success('Order deleted successfully')
        router.refresh()
      } else {
        toast.error('Failed to delete order')
      }
    } catch (error) {
      toast.error('Failed to delete order')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuItem
          onSelect={() => {
            toast.info('Delete order?', {
              action: {
                label: 'Delete',
                onClick: () => {
                  deleteOrder(row.original.orderId as number)
                },
              },
            })
          }}
        >
          <DropdownMenuLabel>Delete</DropdownMenuLabel>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Status = ({ row }: { row: any }) => {
  const [updating, setUpdating] = useState(false)

  const updateStatus = async (status: string) => {
    try {
      setUpdating(true)

      const res = await fetch('/api/order/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: row.original.orderId,
          status,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update order status')
      } else {
        toast.success('Order status updated successfully')
      }
    } catch (err) {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Select onValueChange={updateStatus} defaultValue={row.original.status}>
      <SelectTrigger
        className="rounded-full p-1 px-4 w-[120px]"
        style={{
          pointerEvents: updating ? 'none' : 'auto',
        }}
      >
        {updating ? (
          <span>Upading...</span>
        ) : (
          <SelectValue placeholder="Change order status"></SelectValue>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order Status</SelectLabel>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="SHIPPING">Shipping</SelectItem>
          <SelectItem value="SHIPPED">Shipped</SelectItem>
          <SelectItem value="DELIVERED">Delivered</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
          <SelectItem value="REFUNDED">Refunded</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export const columns: ColumnDef<EnhancedOrder>[] = [
  {
    accessorKey: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
    accessorKey: 'orderId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    cell: ({ row }) => <span className="font-bold">#{row.original.orderId}</span>,
  },
  {
    accessorKey: 'user.firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-xs text-neutral-400">
        {new Date(row.original.createdAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'orderItems',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => {
      const total = row.original.orderItems.reduce((acc: number, item: OrderItem & { product: Product }) => {
        return acc + item.quantity * item.product.price
      }, 0)

      return <span>${total.toFixed(2)}</span>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: Status,
  },
  {
    accessorKey: 'Actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: Actions,
  },
]
