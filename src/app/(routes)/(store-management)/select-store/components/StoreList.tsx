"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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
import { Store } from "@prisma/client";
import Link from "next/link";

interface StoreListProps {
  stores: Store[];
}

export function StoreList({ stores }: StoreListProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const router = useRouter();

  return (
    <div className="p-4 w-[400px] mx-auto border border-neutral-200 rounded-lg">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-semibold text-sm">Select a store to continue</h1>
        <Link href="/create-store">
          <Button variant="outline" className="text-xs rounded-full" size="sm">
            Create a store
          </Button>
        </Link>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? stores.find((store) => store.storeName.toLowerCase() === value)?.storeName
              : "Select a store..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {stores.map((store) => (
                <CommandItem
                  key={store.storeId}
                  value={store.storeName}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue.toLowerCase() === value
                        ? value
                        : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {store.storeName}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === store.storeName.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        disabled={!value}
        onClick={() => {
          const storeUrl = stores.find(
            (store) => store.storeName === value
          )?.storeUrl;
          if (storeUrl) {
            router.push(`/${storeUrl}`);
          }
        }}
        variant={"default"}
        className={"mt-4 w-full"}
      >
        Continue
      </Button>
    </div>
  );
}
