"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useModal, ModalType } from "@/hooks/useModal";
import { toast } from "sonner";
import { use, useState } from "react";

export const CategoryEditModal = () => {
  const router = useRouter();
  const { isOpen, type, data, closeModal } = useModal();
  const [categoryName, setCategoryName] = useState( data ? data.categoryName : "" );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  if (type !== ModalType.EDIT_CATEGORY) return null;
  const open = isOpen && type === ModalType.EDIT_CATEGORY;

  const updateCategory = async (categoryName: string, categoryId: number) => {

    setError("");
    setLoading(true);

    if (categoryName === "") {
      setError("Category name is required");
    } else if (categoryName.length < 3) {
      setError("Category name must be at least 3 characters");
    } else if (!/^[a-zA-Z0-9- ]*$/.test(categoryName)) {
      setError("Category name can only contain letters, numbers, and spaces");
    }

    if (error) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/category", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName, categoryId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast(data.message);
      closeModal();
      router.refresh();
    } catch (err) {
      toast((err as Error).message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogDescription>
            Make changes and Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={data.categoryName}
              className="col-span-3"
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateCategory(categoryName, data.categoryId);
                }
              }}
            />
            <div className='col-start-2 col-span-3'>
              <span className='text-red-500 text-sm'>{error}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              updateCategory(categoryName, data.categoryId);
            }}
          >
           {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
