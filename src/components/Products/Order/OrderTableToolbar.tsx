'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../ProductsTableViewOption'
import { IoMdRefresh } from 'react-icons/io'
import { useRouter } from 'next/navigation'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function OrderDataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by order ID..."
          value={(table.getColumn('orderId')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('orderId')?.setFilterValue(event.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="icon"
          title="Refresh"
          onClick={() => {
            router.refresh()
          }}
        >
          <IoMdRefresh size={16} />
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
