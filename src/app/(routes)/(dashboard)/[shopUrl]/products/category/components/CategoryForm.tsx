"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CategoryFormProps {
  storeUrl: string;
  className?: string;
}

const CategoryFormPropsSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 character long" })
    .max(30, { message: "Too long name" })
    .regex(/^[A-Za-z0-9\s]+$/, { message: "Only letters & numbers are allowed." }),
});

export const CategoryForm = ({ storeUrl, className }: CategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(CategoryFormPropsSchema),
    defaultValues: {
      name: "",
    },
  });

  const submit = async (data: z.infer<typeof CategoryFormPropsSchema>) => {
    setLoading(true);

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: data.name, storeUrl }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      form.reset();
      toast(responseData.message);
      router.refresh();
    } catch (error) {
      toast((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="flex items-end gap-3">
            <FormItem className='relative'>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...form.register("name")} className="max-w-[300px] lg:max-w-[250px]" />
              </FormControl>
              <FormMessage className='absolute top-[100%]'>
                {form.formState.errors.name?.message}
              </FormMessage>
            </FormItem>
            <Button type="submit" variant={"default"}>
              {loading ? "Saving..." : "Create"} 
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
