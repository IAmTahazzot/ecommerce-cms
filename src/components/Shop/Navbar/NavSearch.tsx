"use client";

import Container from "@/components/Shop/Layout/Container";
import { useCart } from "@/hooks/useCart";
import { ModalType, useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Search, ShoppingCart } from "lucide-react";
import localFont from "next/font/local";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SACRAMENTO_FONT = localFont({
  src: "../../../../public/fonts/RemachineScript.ttf",
  display: "swap",
});

const NavSearch = ({ shopName }: { shopName: string }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { openModal } = useModal();
  const { carts } = useCart()

  useEffect(() => {
    let price: number = 0;

    carts.forEach(cart => {
      if (cart.variant && cart.variant.price) {
        price += cart.variant.price * cart.quantity;
      } else {
        price += cart.product.price * cart.quantity;
      }
    });

    const quantity = carts.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(quantity);
    setTotalPrice(parseFloat(price.toFixed(2)));
  }, [carts])

  const path = usePathname()
  const shopUrl = '/shop/' + path.split('/')[2];
  const beautifyShopName =
    shopName.replace(/-/g, " ").slice(0, 1).toUpperCase() +
    shopName.replace(/-/g, " ").slice(1);

  return (
    <div className="border-b-[1px]">
      <Container className="grid grid-cols-[auto_1fr] align-center justify-between py-8">
        <div className="w-[360px]" aria-label="brand name or logo">
          <Link href={shopUrl}>
            <h1
              className={cn(
                SACRAMENTO_FONT.className,
                "text-[48px] leading-[1]"
              )}
            >
              {beautifyShopName}
            </h1>
          </Link>
        </div>
        <div className="h-12 flex items-center justify-between gap-x-3">
          <div className="search-bar relative h-full flex-1">
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <Search size={20} className="text-neutral-800" />
            </span>
            <input
              className="border rounded-full placeholder:text-slate-500 h-full w-full pl-11 pr-3"
              type="text"
              placeholder="Search"
            />
          </div>
          <button
            onClick={() => openModal(ModalType.CART)}
            className="rounded-full bg-[#1d1d1d] font-medium text-white space-x-2 h-full flex items-center px-5"
          >
            <ShoppingCart size={20} />
            <span>${totalPrice}</span>
            <span>({totalQuantity})</span>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default NavSearch;
