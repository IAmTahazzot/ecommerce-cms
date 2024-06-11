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
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const deleteCart = async ({
  id,
  removeFromCart,
}: {
  id: number;
  removeFromCart: (id: number) => void;
}) => {
  try {
    const response = await fetch("/api/cart/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete cart");
    }

    removeFromCart(id);
    toast.error("Cart deleted successfully", {
      position: 'bottom-center'
    });
  } catch (err) {
    toast.error("Failed to delete cart", {
      position: 'bottom-center'
    });
  }
};

export const addQuantity = async ({
  id,
  carts,
  quantity,
  setAdding,
  addCollectionToCart,
}: {
  id: number;
  carts: (CartItemType & { id: number })[];
  quantity: number;
  setAdding: React.Dispatch<React.SetStateAction<boolean>>;
  addCollectionToCart: (items: (CartItemType & { id: number })[]) => void;
}) => {
  setAdding(true);

  try {
    const response = await fetch("/api/cart/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, quantity: quantity + 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to add quantity");
    }

    setAdding(false);

    // updating the quantity in the cart
    const updatedCart = carts.map((cart) => {
      if (cart.id === id) {
        return { ...cart, quantity: cart.quantity + 1 };
      }
      return cart;
    });

    addCollectionToCart(updatedCart);

    // show success message
    toast("Quantity updated", {
      position: "bottom-center",
    });
  } catch (err) {
    setAdding(false);
    toast("Something went wrong, please try again later", {
      position: "bottom-center",
    });
  }
};

export const removeQuantity = async ({
  id,
  carts,
  quantity,
  setDeleting,
  addCollectionToCart,
  removeCart,
}: {
  id: number;
  carts: (CartItemType & { id: number })[];
  quantity: number;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  addCollectionToCart: (items: (CartItemType & { id: number })[]) => void;
  removeCart: (id: number) => void;
}) => {
  setDeleting(true);

  if (quantity === 1) {
    toast.warning("Do you want to remove this item from the cart?", {
      position: 'bottom-center',
      description: "Product quantity must be at least 1 to keep it in the cart",
      action: {
        label: "Yes",
        onClick: () =>
          deleteCart({
            id,
            removeFromCart: removeCart,
          }),
      },
    });
    setDeleting(false);
    return;
  }

  try {
    const response = await fetch("/api/cart/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, quantity: quantity - 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove quantity");
    }

    setDeleting(false);

    // updating the quantity in the cart
    const updatedCart = carts.map((cart) => {
      if (cart.id === id) {
        return { ...cart, quantity: cart.quantity - 1 };
      }
      return cart;
    });

    addCollectionToCart(updatedCart);

    // show success message
    toast("Quantity updated", {
      position: 'bottom-center'
    });
  } catch (err) {
    setDeleting(false);
    toast("Something went wrong, please try again later", {
      position: 'bottom-center'
    });
  }
};

const CartPreview = ({
  id,
  product,
  variant,
  quantity,
}: CartItemType & { id: number }) => {
  const price = (variant && variant.price) || product.price;
  const imageUrl = (variant && variant.imageUrl) || product.images[0].imageUrl;
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { removeFromCart, carts, addCollectionToCart } = useCart();

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
        <h1 className="text-[17px] font-medium tracking-wider">
          ${price.toFixed(2)}
        </h1>
        <h1 className="text-[17px] font-medium">{product.title}</h1>
        <div className="w-fit my-2">
          {variant && (
            <div>
              {variant.size && (
                <span className="text-xs p-1 bg-neutral-100 rounded-lg">
                  {variant.size}
                </span>
              )}
              {variant.size && variant.color && <span> · </span>}
              {variant.color && (
                <span className="text-xs p-1 bg-neutral-100 rounded-lg">
                  {variant.color}
                </span>
              )}
              {variant.color && variant.material && <span> · </span>}
              {variant.material && (
                <span className="text-xs p-1 bg-neutral-100 rounded-lg">
                  {variant.material}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="quantity mt-auto flex items-center gap-x-1">
          <button
            disabled={deleting}
            onClick={() =>
              removeQuantity({
                id,
                quantity,
                carts,
                addCollectionToCart,
                setDeleting,
                removeCart: removeFromCart,
              })
            }
            className="h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black"
          >
            {deleting ? (
              <span className="animate-pulse h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black">
                ⋯
              </span>
            ) : (
              <Minus size={18} />
            )}
          </button>
          <span className="mx-3">{quantity}</span>
          <button
            disabled={adding}
            onClick={() =>
              addQuantity({
                id,
                quantity,
                carts,
                addCollectionToCart,
                setAdding,
              })
            }
            className="h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black"
          >
            {adding ? (
              <span className="animate-pulse h-8 w-8 rounded-full border border-nutral-600 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black">
                ⋯
              </span>
            ) : (
              <Plus size={18} />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() =>
            deleteCart({
              id,
              removeFromCart,
            })
          }
          className="h-8 w-8 rounded-full border border-nutral-600 hidden items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 hover:border-black group-hover:flex"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const CartModal = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { isOpen, type, closeModal } = useModal();
  const shouldOpen: boolean = isOpen && type === ModalType.CART;
  const path = usePathname();
  const storeUrl = "/shop/" + path.split("/")[2] + "/";

  const { carts } = useCart();

  useEffect(() => {
    let price: number = 0;

    carts.forEach((cart) => {
      if (cart.variant && cart.variant.price) {
        price += cart.variant.price * cart.quantity;
      } else {
        price += cart.product.price * cart.quantity;
      }
    });

    const quantity = carts.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(quantity);
    setTotalPrice(parseFloat(price.toFixed(2)));
  }, [carts]);

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
        {carts.length > 0 &&
          carts.map((cart, index) => {
            return (
              <CartPreview
                key={`${cart.id}--${index}--${new Date().getMilliseconds()}`}
                {...cart}
              />
            );
          })}

        {carts.length < 1 && (
          <div className="text-center my-4">Your cart is empty</div>
        )}
      </main>

      <div className="h-[1px] w-full bg-neutral-300 my-5"></div>
      <div className="px-10 mt-10 mb-4">
        <span>Total</span>
        <h1 className="text-6xl font-medium text-[#1d1d1d] flex justify-between items-center">
          ${totalPrice}
        </h1>
      </div>
      <p className="px-10 text-sm text-neutral-700">
        Taxes and shipping calculated at checkout
      </p>
      <div className="controls p-10 space-y-3">
        <Link
          href={storeUrl}
          onClick={() => {
            closeModal();
          }}
          className="rounded-full bg-black text-white py-4 flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300"
        >
          Continue Shopping
        </Link>
        <SignedIn>
          <Link
            // href={storeUrl + "profile?address=ACTIVE"}
            href={storeUrl + "checkout"}
            onClick={() => {
              closeModal();
            }}
            className="rounded-full border-2 border-black text-black py-3 hover:text-white flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300"
          >
            Checkout
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton afterSignInUrl={storeUrl} afterSignUpUrl={storeUrl}>
            <Button
              variant="ghost"
              className="w-full h-14 rounded-full border-2 border-black text-black py-3 hover:text-white flex items-center justify-center text-[20px] font-medium hover:bg-[#1d1d1d] transition-colors duration-300"
            >
              Sign in to Checkout
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default CartModal;
