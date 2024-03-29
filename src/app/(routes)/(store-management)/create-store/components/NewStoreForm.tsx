"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import z from "zod";
import type { User } from "@prisma/client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface NewStoreFormProps {
  user: User;
}
const schema = z.object({
  storeName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets are allowed" })
    .min(3, { message: "Store name must be at least 3 characters long" })
    .max(255, { message: "Store name must not exceed 255 characters" }),
});

const resolver = zodResolver(schema);
const defaultValues = schema.parse({ storeName: "Your store" });

export const NewStoreForm = ({ user }: NewStoreFormProps) => {
  const form = useForm<z.infer<typeof schema>>({ resolver, defaultValues });
  const [processingMessage, setProcessingMessage] = useState<string>("");
  const [storeExists, setStoreExists] = useState<boolean>(false);
  const [storeUrl, setStoreUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { isLoaded, user: userData } = useUser();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const newStoreUrl = data.storeName.toLowerCase().replace(/\s/g, "-");

    if (!userData) {
      toast("You need to be logged in to create a store.", {
        description: "Please login or sign up to continue.",
        position: "bottom-center",
      });

      return false;
    }

    // check if store exists
    try {
      setLoading(true);

      setProcessingMessage("Checking store name availability...");
      const res = await fetch("/api/store/check-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeUrl: newStoreUrl }),
      });

      const checkStore = (await res.json()) as { storeExists: boolean };

      // STOP processing if store exists
      if (checkStore.storeExists) {
        setStoreExists(true);
        setLoading(false);
        return false;
      }

      setStoreExists(false);
    } catch (error) {
      toast("An error occurred while creating your store.", {
        description: "Please try again later or refresh the page.",
        position: "bottom-center",
      });

      setLoading(false);
    }

    // create a store and redirect
    try {
      setLoading(true);

      setProcessingMessage("Creating your store...");
      const newStore = await fetch("/api/store/create-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName: data.storeName,
          storeUrl: newStoreUrl,
        }),
      });

      const storeData = await newStore.json();

      if (storeData.store) {
        // Create default categories, products and billboards
        setProcessingMessage("Creating demo categories...");

        const categoriesResponse = await Promise.all([
          fetch("/api/category", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryName: "Uncategorized",
              storeUrl: storeData.store.storeUrl,
            }),
          }),

          fetch("/api/category", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryName: "Cloth",
              storeUrl: storeData.store.storeUrl,
            }),
          }),

          fetch("/api/category", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryName: "Food",
              storeUrl: storeData.store.storeUrl,
            }),
          }),
        ]);

        const uncategorizedCategory = await categoriesResponse[0].json();
        const clothCategory = await categoriesResponse[1].json();
        const foodCategory = await categoriesResponse[2].json();

        setProcessingMessage("Creating demo variable product...");
        const variants: {
          size: string;
          color: string;
          material: string;
          inventory: number;
          price: number;
        }[] = [
          {
            size: "7",
            color: "White",
            material: "Leather",
            inventory: 30,
            price: 49.99,
          },
          {
            size: "8",
            color: "White",
            material: "Leather",
            inventory: 20,
            price: 49.99,
          },
          {
            size: "7",
            color: "Black",
            material: "Leather",
            inventory: 50,
            price: 80.99,
          },
          {
            size: "8",
            color: "Black",
            material: "Leather",
            inventory: 30,
            price: 70.99,
          },
        ];

        const newProducts = await Promise.all([
          fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userData.id,
              storeId: storeData.store.storeId,
              categoryId: clothCategory.data.categoryId,
              title: "Sneakers for men",
              description:
                "<h1>Man sneakers</h1><p>It is a cool shoes to try on sunny day.</p>",
              price: 49.99,
              inventory: 100,
              costPerProduct: 25.0,
              compareAtPrice: 59.99,
              status: "ACTIVE",
              allowPurchaseOutOfStock: true,
              variants: variants,
            }),
          }),

          fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userData.id,
              storeId: storeData.store.storeId,
              categoryId: foodCategory.data.categoryId,
              title: "Dragon fruit",
              description:
                "<h1>Fruit of the dragon</h1><p>Try first then pay</p>",
              price: 1.99,
              inventory: 100,
              costPerProduct: 0.5,
              compareAtPrice: 2.99,
              status: "ACTIVE",
              allowPurchaseOutOfStock: true,
            }),
          }),
        ]);

        const clothProduct = await newProducts[0].json();
        const foodProduct = await newProducts[1].json();

        setProcessingMessage("Creating demo product images...");
        await Promise.all([
          fetch("/api/store/demo-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productsId: [clothProduct.data.productId, foodProduct.data.productId],
            }),
          }),
        ]);

        setProcessingMessage("Creating demo billboard...");
        await Promise.all([
          fetch("/api/billboard", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "Food & Drinks",
              subtitle: "It's time to fill up",
              categoryId: foodCategory.data.categoryId,
              shopUrl: storeData.store.storeUrl,
              autoImage: "/demo/food-billboard.webp",
            }),
          }),
          fetch("/api/billboard", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "Summer Sale",
              subtitle: "Get up to 50% off on all summer items",
              categoryId: clothCategory.data.categoryId,
              shopUrl: storeData.store.storeUrl,
              autoImage: "/demo/cloth-billboard.png",
            }),
          }),
        ]);

        toast(`Your store ${data.storeName} has been created!`, {
          description: "You will be redirected to your store shortly.",
          position: "bottom-center",
        });
        router.push(`/${storeData.store.storeUrl}`);
      }
    } catch (error) {
      toast("An error occurred while creating your store.", {
        description: "Please try again later or refresh the page.",
        position: "bottom-center",
      });

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-neutral-200 rounded-lg w-[400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder="ex: Fashion 247"
                    autoComplete="off"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setStoreUrl(
                        e.target.value.toLowerCase().replace(/\s/g, "-")
                      );
                      setStoreExists(false);
                    }}
                    className={cn(
                      storeExists ||
                        (form.formState.errors.storeName &&
                          "border-red-600 focus-visible:ring-red-600")
                    )}
                  />
                </FormControl>
                <FormDescription>
                  {storeUrl &&
                    !storeExists &&
                    !form.formState.errors.storeName && (
                      <span>
                        Your store url will be{" "}
                        <span className="font-bold text-emerald-600">
                          {storeUrl}
                        </span>
                      </span>
                    )}
                  {!storeUrl &&
                    !storeExists &&
                    !form.formState.errors.storeName && (
                      <span>
                        This will be your store name and cannot be changed
                        later.
                      </span>
                    )}
                  {storeExists && !form.formState.errors.storeName && (
                    <span>
                      <span className="font-bold text-red-600">{storeUrl}</span>{" "}
                      is already taken. Please try another name.
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {userData && (
            <Button variant={"default"} type="submit" className="mt-4">
              {!loading && "Create"}
              {loading && (
                <div className="flex items-center justify-center gap-x-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{processingMessage}</span>
                </div>
              )}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
