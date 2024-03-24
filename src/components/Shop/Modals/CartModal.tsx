"use client";

import { ModalType, useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { CartItemType } from "../Products/Product";
import { useCart } from "@/hooks/useCart";

const CartPreview = ({
  id,
  product,
  variant,
  quantity,
}: CartItemType & { id: number }) => {
  const price = (variant && variant.price) || product.price;
  const imageUrl = (variant && variant.imageUrl) || product.images[0].imageUrl;

  return (
    <div className="px-10 flex gap-x-3 mb-4 group">
      <div className="group/cart relative h-28 w-24 rounded-[12px] border overflow-hidden cursor-pointer">
        <Image
          src={`https://utfs.io/f/${imageUrl}`}
          alt=""
          fill
          className="object-cover group-hover/cart:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col flex-1">
        <h1 className="text-[17px] font-medium tracking-wider">{price}</h1>
        <h1 className="text-[17px] font-medium">{product.title}</h1>

        <div className="quantity mt-auto flex items-center gap-x-1">
          <button className="h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black">
            <Minus size={18} />
          </button>
          <span className="mx-3">{quantity}</span>
          <button className="h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black">
            <Plus size={18} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button className="h-8 w-8 rounded-full border border-nutral-600 hidden items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black group-hover:flex">
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const CartModal = () => {
  const { isOpen, type, closeModal } = useModal();
  const shouldOpen: boolean = isOpen && type === ModalType.CART;
  const path = usePathname();
  const storeUrl = "/shop/" + path.split("/")[2] + "/";

  const { carts } = useCart();

  console.log(carts)

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full bg-white lg:w-[400px] z-[100] shadow-lg overflow-y-auto",
        "translate-x-full transition-transform duration-300 ease-in-out",
        shouldOpen && "translate-x-0"
      )}
    >
      <header className="flex items-center justify-between p-10">
        <h1 className="text-2xl font-medium text-[#1d1d1d]">Your Cart</h1>
        <button onClick={closeModal}>
          <X size={32} className="cursor-pointer" />
        </button>
      </header>

      <main className="content">
        {carts.map((cart) => {
          return <CartPreview key={cart.id} {...cart} />;
        })}

        {carts.length < 1 && (
          <div className="text-center my-4">Your cart is empty</div>
        )}
      </main>

      <div className="controls p-10 space-y-3">
        <Link
          href={storeUrl}
          className="rounded-full bg-black text-white py-4 flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300"
        >
          Continue Shopping
        </Link>
        <Link
          href="all-products"
          className="rounded-full border-2 border-black text-black py-3 hover:text-white flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartModal;
