"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { CiShop } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Shop {
  name: string;
  id: string;
}

interface SwitchShopProps {
  shops: Shop[];
}

export const SwitchShop = ({ shops }: SwitchShopProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'secondary'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between h-8"
        >
          <div className='flex items-center gap-x-2'>
            <CiShop className="h-5 w-5" />
            <span>
              {value
                ? shops.find((shop) => shop.id === value)?.name
                : "Select shop..."}
            </span>
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 h-full">
        <Command>
          <CommandInput placeholder="Search shop..." className="h-9" />
          <CommandEmpty>No shop found.</CommandEmpty>
          <CommandGroup>
            {shops.map((shop) => (
              <CommandItem
                key={shop.id}
                value={shop.name}
                onSelect={(currentValue) => {
                  const getShopId = shops.find((s) => s.name.toLowerCase() === currentValue.toLowerCase())?.id;
                  if (!getShopId) return;

                  if (currentValue === value) return setOpen(false);

                  if (currentValue !== value) {
                    setValue(getShopId);
                    setOpen(false);
                  }

                  setOpen(false);
                }}
              >
                {shop.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === shop.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
