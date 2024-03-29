"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";

import { ModalType, useModal } from "@/hooks/useModal";
import { useUser } from "@clerk/nextjs";
import { Address } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const PaymentModal = () => {
  const router = useRouter();
  const path = usePathname();
  const storeUrl = path.split("/")[2];
  const [loading, setLoading] = useState(false);
  const { isOpen, type, closeModal } = useModal();
  const { isLoaded, user } = useUser();
  const shouldOpen: boolean = isOpen && type === ModalType.PAYMENT;
  const { addCollectionToCart } = useCart()

  const pay = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/checkout/pay", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Payment successful");
        closeModal();
        router.push(`/shop/${storeUrl}/orders`);
        addCollectionToCart([])
      }

      if (response.status === 500) {
        toast.error("Payment failed", {
          description: data.error || "Please try again or contact support.",
        });
      }
    } catch (error) {
      toast.error("Payment failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="my-4 text-center">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Dialog open={shouldOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[425px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              <span className="text-muted-foreground">
                Stripe was implemented here, but it was removed for security
                reasons. Click pay to proceed. Any payment method can be
                implemented here.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <Button
              onClick={pay}
              variant="default"
              size="lg"
              className="h-14 w-full mt-6"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
