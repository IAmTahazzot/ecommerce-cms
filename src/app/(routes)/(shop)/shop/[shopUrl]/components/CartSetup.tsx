'use client'

import { CartItemType } from "@/components/Shop/Products/Product";
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface CartSetupProps {
  carts: (CartItemType & { id: number})[],
  userId: any | null,
  sessionId: string | undefined
}

export const CartSetup = ( { carts, userId, sessionId }: CartSetupProps ) => {
  const { addCollectionToCart } = useCart();
  const router = useRouter()

  useEffect(() => {
    addCollectionToCart(carts);

    const mergeCarts = async () => {
      await fetch(`/api/cart/merge-carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          sessionId,
        }),
      })
    }

    if (userId && sessionId) {
      mergeCarts();
      console.log('Available carts are being merged...')
      router.refresh()
    }

  }, [addCollectionToCart, carts])

  return null;
}