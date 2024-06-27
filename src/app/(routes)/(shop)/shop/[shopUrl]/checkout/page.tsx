"use client";

import Container from "@/components/Shop/Layout/Container";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addQuantity,
  deleteCart,
  removeQuantity,
} from "@/components/Shop/Modals/CartModal";
import { Button } from "@/components/ui/button";
import { CartItemType } from "@/components/Shop/Products/Product";
import { toast } from "sonner";
import { ModalType, useModal } from "@/hooks/useModal";
import { Address } from "@prisma/client";

export default function Checkout() {
  const { carts } = useCart();
  const { openModal } = useModal();
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const storeUrl = path.split("/")[2];
  const [address, setAddress] = useState<Address | null>();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`/api/address`);
        const data = await response.json();

        if (response.status === 200) {
          setAddress(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAddress();
  }, []);

  const handleCheckout = async () => {
    setProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.status === 400) {
        openModal(ModalType.ADDRESS);

        toast.warning("You must have an address to checkout", {
          description: "You can add an address in your profile page",
          action: {
            label: "Add address",
            onClick: () => {
              router.push(`/shop/${storeUrl}/profile`);
            },
          },
        });

        return false;
      }

      if (response.status === 200) {
        openModal(ModalType.PAYMENT);
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-10">
        <div className="col-span-1 md:col-span-4">
          <h1 className="text-3xl font-bold mb-4">Cart items</h1>

          <div className="w-full border rounded-md overflow-x-auto">
            {carts && carts.length > 0 ? (
              <table className="w-[600px] md:w-full text-[13px]">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-2 py-3 text-xs font-medium text-neutral-500">
                      Product
                    </th>
                    <th className="px-2 py-3 text-xs font-medium text-neutral-500">
                      Price
                    </th>
                    <th className="px-2 py-3 text-xs font-medium text-neutral-500">
                      Quantity
                    </th>
                    <th className="px-2 py-3 text-xs font-medium text-neutral-500">
                      Total
                    </th>
                    <th className="px-2 py-3 text-xs font-medium text-neutral-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => (
                    <CartItem key={cart.id} cart={cart} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 text-center">Your cart is empty</div>
            )}
          </div>

          {/* user address */}
          <div className="mt-6">
            <div className="bg-neutral-50 rounded-lg p-6">
              {address && (
                <div className="text-sm">
                  <h2 className="text-lg font-bold mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <p className="font-semibold">Country:</p>
                    <p>{address.country}</p>
                    <p className="font-semibold">Address 1:</p>
                    <p>{address.addressOne}</p>
                    <p className="font-semibold">City & State:</p>
                    <p>
                      {address.city}, {address.state || ""}
                    </p>
                    <p className="font-semibold">Zip:</p>
                    <p>{address.zipcode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {carts.length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <div className="w-full md:max-w-[320px] mx-auto">
              <h1 className="text-3xl font-bold mb-4">Checkout</h1>

              <div className="bg-neutral-100 rounded-md p-4 text-sm space-y-4">
                <div className="flex justify-between mt-3">
                  <p>Subtotal</p>
                  <p>
                    $
                    {carts
                      .reduce(
                        (acc, item) => acc + item.quantity * (item.variant?.price || item.product.price ),
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <p>Shipping</p>
                  <p>$16.00</p>
                </div>
                <div className="flex justify-between mt-3 font-bold">
                  <p>Total</p>
                  <p>
                    $
                    {(
                      carts.reduce(
                        (acc, item) => acc + item.quantity * (item.variant?.price || item.product.price),
                        0
                      ) + 16
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="h-6"></div>
                <Button
                  disabled={processing}
                  onClick={handleCheckout}
                  variant={"default"}
                  size="lg"
                  className="w-full h-12 group"
                >
                  {processing ? (
                    <div className="flex items-center gap-x-1">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-black group-hover:text-white"
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
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Proceed to checkout"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

function CartItem({ cart }: { cart: CartItemType & { id: number } }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { removeFromCart, carts, addCollectionToCart } = useCart();
  const path = usePathname();
  const shopUrl = path.split("/")[2];

  const imageUrl =
    "https://utfs.io/f/" +
    ((cart.variant && cart.variant.imageUrl) ||
      cart.product.images[0].imageUrl);
  const price: number = (
    (cart.variant && cart.variant.price) ||
    cart.product.price
  ).toFixed(2) as unknown as number;
  const variant = cart.variant;

  return (
    <tr key={cart.id} className="p-4">
      <td className="px-2 py-5 flex items-center gap-x-2">
        <Image
          src={imageUrl}
          alt={cart.product.title}
          width={40}
          height={40}
          className="rounded-md object-cover overflow-hidden"
        />
        <div>
          <Link
            href={`/shop/${shopUrl}/product/${cart.product.productId}`}
            className="hover:underline w-72 text-wrap"
          >
            <h3 className="font-bold">{cart.product.title}</h3>
          </Link>
          <p className="mt-2">
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
          </p>
        </div>
      </td>
      <td className="px-2 py-5">${price}</td>
      <td className="px-2 py-5">
        <div className="quantity mt-auto flex items-center gap-x-1">
          <button
            disabled={deleting}
            onClick={() =>
              removeQuantity({
                id: cart.id,
                quantity: cart.quantity,
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
          <span className="mx-3">{cart.quantity}</span>
          <button
            disabled={adding}
            onClick={() =>
              addQuantity({
                id: cart.id,
                quantity: cart.quantity,
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
      </td>
      <td className="px-2 py-5">${(price * cart.quantity).toFixed(2)}</td>
      <td className="px-2 py-5">
        <Button
          variant={"ghost"}
          size="icon"
          onClick={() => {
            deleteCart({
              id: cart.id,
              removeFromCart,
            });
          }}
        >
          <X size={18} />
        </Button>
      </td>
    </tr>
  );
}
