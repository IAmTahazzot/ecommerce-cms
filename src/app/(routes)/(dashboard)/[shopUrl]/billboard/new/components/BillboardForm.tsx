"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/Upload/FileUpload";
import { FaMinus } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { CategoriesDropdown } from "../../../products/new/components/CategoriesDropdown";
import { BillboardProps } from "@/components/Products/Billboard/Columns";

const BillboardFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be between 5 and 32 characters" })
    .max(32, { message: "Title must be between 5 and 32 characters" }),
  subtitle: z
    .string()
    .min(5, { message: "Subtitle must be between 5 and 64 characters" })
    .max(64, { message: "Subtitle must be between 5 and 64 characters" }),
  imageUrl: z.string(),
  categoryId: z.number(),
});

export const BillboardForm = ({
  shopUrl,
  categories,
  billboard,
}: {
  shopUrl: string;
  categories: Category[];
  billboard?: BillboardProps;
}) => {
  const [files, setFiles] = useState([] as { imageUrl: string }[]);
  const form = useForm({
    resolver: zodResolver(BillboardFormSchema),
    defaultValues: {
      title: billboard?.title || "",
      subtitle: billboard?.subtitle || "",
      imageUrl: billboard?.imageUrl || "",
      categoryId: billboard?.category.categoryId || -1,
    },
  });

  useEffect(() => {
    if (billboard?.imageUrl) {
      setFiles([{ imageUrl: billboard.imageUrl }]);
    }
  }, [billboard]);

  const handleSubmit = async (data: z.infer<typeof BillboardFormSchema>) => {
    if (files.length === 0) {
      form.setError("imageUrl", {
        message: "Please upload an image",
      });

      return;
    }

    const bodyData = {
      title: data.title,
      subtitle: data.subtitle,
      imageUrl: files[0].imageUrl,
      categoryId: data.categoryId,
      shopUrl,
    } as any;

    if (billboard) {
      bodyData["billboardId"] = billboard.id;
    }

    try {
      const response = await fetch("/api/billboard", {
        method: billboard ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        form.reset();
        setFiles([]);
        toast("Billboard has been saved!");
      } else {
        toast("An error occurred while saving the billboard.");
      }
    } catch (error) {
      toast("An error occurred while saving the billboard.");
    }
  };

  const deleteFile = async (imageUrl: string) => {
    // remove the file from the files state
    const newFiles = files.filter((file) => file.imageUrl !== imageUrl);
    setFiles(newFiles);

    // delete the file (only one file) from the server using the API
    try {
      const response = await fetch("/api/products/deleteImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        toast("Billboard image has been deleted!");
      }
    } catch (error) {
      toast("An error occurred while deleting the image.");
    }
  };

  return (
    <div>
      <h1 className="font-semibold mb-5">New billboard</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl>
              <Input {...form.register("title")} />
            </FormControl>
            <FormMessage>{form.formState.errors.title?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
            <FormControl>
              <Input {...form.register("subtitle")} />
            </FormControl>
            <FormMessage>{form.formState.errors.subtitle?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="categoryId" className="block mb-2">
              Category
            </FormLabel>

            <CategoriesDropdown
              categories={categories}
              onSelect={(categoryId) => {
                form.setValue("categoryId", categoryId);
              }}
              activeCategoryId={
                billboard?.category.categoryId?.toString() || "1"
              }
            />
            <FormMessage>
              {form.formState.errors.categoryId?.message}
            </FormMessage>
          </FormItem>

          <div className="mb-4">
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.imageUrl}
                    className="relative h-[150px] border rounded group"
                  >
                    <Button
                      onClick={() => {
                        deleteFile(file.imageUrl);
                      }}
                      variant={"ghost"}
                      size={"icon"}
                      className="z-10 hidden group-hover:flex absolute top-3 right-3 rounded-full h-4 w-4 bg-white items-center justify-center border cursor-pointer"
                    >
                      <FaMinus size={12} />
                    </Button>
                    <Image
                      src={"https://utfs.io/f/" + file.imageUrl}
                      alt="product image"
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <FormItem>
            <FormLabel htmlFor="imageUrl">Image URL</FormLabel>
            {files.length === 0 && (
              <FileUpload
                endpoint={"billboardImage"}
                onFileUploadComplete={(res) => {
                  setFiles([{ imageUrl: res[0].key }]);
                }}
              />
            )}
            <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormControl>
              <Button type="submit">
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </FormControl>
          </FormItem>
        </form>
      </Form>
    </div>
  );
};
