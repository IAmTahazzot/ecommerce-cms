"use client";

import { z } from "zod";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";

import data from "@/data/countries.json";
import { cn } from "@/lib/utils";
import React, { SetStateAction, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Address } from "@prisma/client";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModal, ModalType } from "@/hooks/useModal";

const AddressFormSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  addressOne: z.string().min(20, {
    message: "Address must be detailed and at least 20 characters long",
  }),
  addressTwo: z.string().optional(),
  phoneNumber: z
    .string()
    .min(9, { message: "Phone number must be at least 9 characters long" }),
  state: z.string().optional(),
  zip: z
    .string()
    .min(4, { message: "Zip code must be at least 4 characters long" }),
});

export const AddressForm = ({
  address,
  isModal = false,
}: {
  address: Address | undefined;
  isModal?: boolean;
}) => {
  const [country, setCountry] = React.useState<keyof typeof data | "">("");
  const { closeModal } = useModal()
  const router = useRouter();
  const params = useSearchParams();
  const path = usePathname();
  const storeUrl = path.split("/")[2];

  const form = useForm({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      country: address?.country ?? "",
      city: address?.city ?? "",
      addressOne: address?.addressOne ?? "",
      addressTwo: address?.addressTwo ?? "",
      phoneNumber: address?.phoneNumber ?? "",
      state: address?.state ?? "",
      zip: address?.zipcode ?? "",
    },
  });

  const submit = async (formData: z.infer<typeof AddressFormSchema>) => {
    try {
      const response = await fetch("/api/address", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success("Address information saved successfully.");
      router.refresh();

      if (isModal) {
        closeModal();
      }
    } catch (error) {
      toast.error("Unable to save address information. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Address information</h1>

      <div className="mt-7 max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="flex gap-x-6">
              <FormItem className="flex-1">
                <FormLabel htmlFor="country" className="block">
                  Country
                </FormLabel>
                <SelectCountry form={form} setCountry={setCountry} />
                <FormMessage className="h-10">
                  {form.formState.errors.country?.message}
                </FormMessage>
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel htmlFor="city" className="block">
                  City
                </FormLabel>
                <SelectCity form={form} country={country} />
                <FormMessage>{form.formState.errors.city?.message}</FormMessage>
              </FormItem>
            </div>

            <div className="flex gap-x-6 mt-6">
              <FormItem className="flex-1">
                <FormLabel htmlFor="city" className="block">
                  State
                </FormLabel>
                <Input
                  id="state"
                  placeholder="Enter your state..."
                  {...form.register("state")}
                />
                <FormMessage>
                  {form.formState.errors.state?.message}
                </FormMessage>
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel htmlFor="zip" className="block">
                  Zip code
                </FormLabel>
                <Input
                  id="zip"
                  placeholder="Enter your zip code..."
                  className="font-mono tracking-[10px] placeholder:tracking-normal placeholder:font-sans"
                  {...form.register("zip")}
                />
                <FormMessage>{form.formState.errors.zip?.message}</FormMessage>
              </FormItem>
            </div>

            <FormItem className="mt-6">
              <FormLabel htmlFor="phoneNumber" className="block">
                Phone number
              </FormLabel>
              <Input
                id="phoneNumber"
                placeholder="Enter your phone number..."
                {...form.register("phoneNumber")}
              />
              <FormMessage>
                {form.formState.errors.phoneNumber?.message}
              </FormMessage>
            </FormItem>

            <FormItem className="mt-6">
              <FormLabel htmlFor="address" className="block">
                Address Line 1
              </FormLabel>
              <Textarea
                id="address"
                placeholder="Enter your address..."
                onInput={(e) => {
                  // auto grow textarea
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height =
                    e.currentTarget.scrollHeight + "px";
                }}
                className="resize-none overflow-hidden leading-6"
                {...form.register("addressOne")}
              />
              <FormMessage>
                {form.formState.errors.addressOne?.message}
              </FormMessage>
            </FormItem>
            <FormItem className="mt-6">
              <FormLabel htmlFor="address" className="block">
                Address Line 2
              </FormLabel>
              <Textarea
                id="address"
                placeholder="Enter your second address (optional)..."
                onInput={(e) => {
                  // auto grow textarea
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height =
                    e.currentTarget.scrollHeight + "px";
                }}
                className="resize-none overflow-hidden leading-6"
                {...form.register("addressTwo")}
              />
              <FormMessage>
                {form.formState.errors.addressTwo?.message}
              </FormMessage>
            </FormItem>

            {isModal ? (
              <div className='flex justify-end'>
                <Button
                  variant={"default"}
                  className="h-12 mt-7"
                  type="submit"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save & Checkout"}
                </Button>
              </div>
            ) : (
              <Button
                variant={"default"}
                className="w-24 h-12 mt-7"
                type="submit"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

const SelectCountry = ({
  form,
  setCountry,
}: {
  form: any;
  setCountry: React.Dispatch<SetStateAction<keyof typeof data | "">>;
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(form.getValues("country") ?? "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="country"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? Object.entries(data).find(
                ([country]) => country.toLowerCase() === value
              )?.[0] ?? value
            : "Select country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {Object.entries(data).map(([country]) => (
              <CommandItem
                key={country}
                value={country}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue.toLowerCase() === value ? value : currentValue
                  );
                  // dropdown value is lowercase & somehow I can't control it, so we need to find the original name
                  const originalName = Object.entries(data).find(
                    ([country]) => country.toLowerCase() === currentValue
                  )?.[0];
                  setCountry(originalName as keyof typeof data);
                  form.setValue("country", originalName);
                  form.setValue("city", "");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country ? "opacity-100" : "opacity-0"
                  )}
                />
                {country}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const SelectCity = ({
  form,
  country,
}: {
  form: any;
  country: keyof typeof data | "";
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(form.getValues("city") ?? "");
  const [cities, setCities] = React.useState<string[]>([]);

  useEffect(() => {
    if (country !== "") {
      setCities(data[country] ?? []);
    } else {
      const country = Object.entries(data).find(
        ([c]) => c.toLowerCase() === form.getValues("country")
      );
      setCities(country ? country[1] : []);
    }
  }, [country, form]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="city"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? cities.find((city) => city.toLowerCase() === value) ?? value
            : "Select city..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search a city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {cities.length > 0 &&
              cities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue.toLowerCase() === value
                        ? value
                        : currentValue
                    );

                    // dropdown value is lowercase & somehow I can't control it, so we need to find the original city name
                    const originalCityName = cities.find(
                      (city) => city.toLowerCase() === currentValue
                    );
                    form.setValue("city", originalCityName);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
