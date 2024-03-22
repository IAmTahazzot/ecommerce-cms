"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CategoriesDropdownPros {
  categories: {
    categoryId: number,
    categoryName: string,
  }[],
  onSelect: (categoryId: number) => void,
  activeCategoryId?: string
}

export function CategoriesDropdown({
  categories,
  onSelect,
  activeCategoryId
}: CategoriesDropdownPros) {
  const activeCategoryName = categories.find((category) => category.categoryId === Number(activeCategoryId))?.categoryName
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(activeCategoryName?.toLowerCase() || "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {
            value
              ? categories.find((category) =>  category.categoryName.toLowerCase() === value)?.categoryName
              : "Select category..."
          }
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.categoryName}
                value={category.categoryName}
                onSelect={(currentValue) => {
                  setValue(currentValue)
                  setOpen(false)

                  // Find the category id
                  const categoryId = categories.find(
                    (category) => category.categoryName.toLowerCase()  === currentValue
                  )?.categoryId

                  if (categoryId) {
                    onSelect(categoryId)
                  } else {
                    onSelect(-1)
                  }
                }}
              >
                {category.categoryName}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === category.categoryName ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
