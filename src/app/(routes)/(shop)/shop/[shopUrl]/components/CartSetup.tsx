'use client'

import { CartItemType } from "@/components/Shop/Products/Product";
import { useCart } from "@/hooks/useCart"
import { useEffect } from "react";

interface CartSetupProps {
  carts: (CartItemType & { id: number})[]
}

export const CartSetup = ( { carts }: CartSetupProps ) => {
  const { addCollectionToCart } = useCart();

  useEffect(() => {
    addCollectionToCart(carts);
  }, [carts])

  return null;
}