"use client";

import Container from "@/components/Shop/Layout/Container";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Address,
  Image as ImageType,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  PaymentStatus,
  Product,
  Variant,
} from "@prisma/client";
import { cn } from "@/lib/utils";

export default function OrdersView() {
  const path = usePathname();
  const storeUrl = path.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [address, setAddress] = useState<Address | null>();
  const [orders, setOrders] = useState<
    (Order & {
      orderItems: (OrderItem & {
        product: Product & { images: ImageType[] };
        variant: Variant | null;
      })[];
      Payment: Payment[];
    })[]
  >([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/address"),
          fetch("/api/order"),
        ]);

        const addressData = await responses[0].json();
        const ordersData = await responses[1].json();

        if (addressData) {
          setAddress(addressData);
        }

        if (ordersData) {
          setOrders(ordersData.orders);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const deleteOrder = async (orderId: number) => {
    try {
      setDeleting(true);
      const response = await fetch("/api/order", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const newOrders = orders.filter((order) => order.orderId !== orderId);
        setOrders(newOrders);
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="max-w-[1000px] mx-auto">
          <div className="w-full">
            <h1 className="text-3xl font-bold my-7">Your orders</h1>
            <div className="w-full border rounded-md mb-7">
              <div className="p-5 text-center">Loading...</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-[1000px] mx-auto">
        <div className="w-full">
          <h1 className="text-3xl font-bold my-7">Your orders</h1>

          {orders && orders.length > 0 ? (
            orders.map((orderItem) => (
              <div
                key={orderItem.orderId}
                className="w-full border rounded-md mb-7"
              >
                <div className="border-b">
                  <div className="grid grid-cols-[120px_1fr] gap-2 text-xs p-2">
                    <span></span>
                    <div className=" justify-self-end">
                      <Button
                        variant={"destructive"}
                        size="sm"
                        onClick={() => {
                          toast.warning("Are you sure you want to cancel this order?", {
                            description: 'This action cannot be undone. Avoid it if you are not sure.',
                            position: 'top-center',
                            action: {
                              label: 'Yes, cancel order',
                              onClick: () => {
                                deleteOrder(orderItem.orderId);
                              }
                            }
                          })
                        }}
                      >
                        {deleting ? "Deleting..." : "Cancel Order"}
                      </Button>
                    </div>

                    <span className="font-semibold">Order ID</span>
                    <span>#{orderItem.orderId}</span>

                    <span className="font-semibold">Order Date</span>
                    <span>
                      {new Date(orderItem.createdAt).toLocaleDateString()}
                    </span>

                    <span className="font-semibold">Status</span>
                    <div>
                      <span
                        className={cn(
                          "p-1 rounded",
                          orderItem.status === OrderStatus.PENDING &&
                            "text-yellow-500 bg-yellow-50"
                        )}
                      >
                        {orderItem.status}
                      </span>
                    </div>

                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      ${orderItem.Payment[0].amount.toFixed(2)} -{" "}
                      <span className="text-muted-foreground">
                        (Including VAT and shipping)
                      </span>
                    </span>

                    <span className="font-semibold">Payment status</span>
                    <div>
                      <span
                        className={cn(
                          "p-1 rounded",
                          // Payment is array but it just single payment; Change was made after the API was written
                          orderItem.Payment[0].status ===
                            PaymentStatus.SUCCESS &&
                            "text-green-500 bg-green-50"
                        )}
                      >
                        {orderItem.Payment[0].status}
                      </span>
                    </div>
                  </div>

                  <table className="w-full text-[13px]">
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
                      </tr>
                    </thead>
                    <tbody>
                      {orderItem.orderItems.map((orderItem) => (
                        <OrderItem
                          key={orderItem.orderItemId}
                          orderItem={orderItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full border rounded-md mb-7">
              <div className="p-5 text-center">
                You have not made any orders yet.
              </div>
            </div>
          )}

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
      </div>
    </Container>
  );
}

function OrderItem({
  orderItem,
}: {
  orderItem: OrderItem & {
    product: Product & { images: ImageType[] };
    variant: Variant | null;
  };
}) {
  const path = usePathname();
  const shopUrl = path.split("/")[2];

  const imageUrl =
    "https://utfs.io/f/" +
    ((orderItem.variant && orderItem.variant.imageUrl) ||
      orderItem.product.images[0].imageUrl);

  const price: number = (
    (orderItem.variant && orderItem.variant.price) ||
    orderItem.product.price
  ).toFixed(2) as unknown as number;
  const variant = orderItem.variant;

  return (
    <tr className="pb-4">
      <td className="px-2 py-5 flex items-center gap-x-2">
        <Image
          src={imageUrl}
          alt={orderItem.product.title}
          width={40}
          height={40}
          priority={false}
          className="rounded-md object-cover overflow-hidden"
        />
        <div>
          <Link
            href={`/shop/${shopUrl}/product/${orderItem.product.productId}`}
            className="hover:underline w-72 text-wrap"
          >
            <h3 className="font-bold">{orderItem.product.title}</h3>
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
          <span className="mx-3">{orderItem.quantity}</span>
        </div>
      </td>
      <td className="px-2 py-5">${(price * orderItem.quantity).toFixed(2)}</td>
    </tr>
  );
}
