import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export const POST = async (request: Request) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to checkout" },
      { status: 401 }
    );
  }

  // make order with payment
  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: {
      cartItems: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (cart && cart.cartItems.length > 0) {
    // calculate total amount
    let subTotal = 0;
    const shipping = 16;

    cart.cartItems.forEach((item) => {
      if (item.variant && item.variant.price) {
        subTotal += item.variant.price * item.quantity;
      } else {
        subTotal += item.product.price * item.quantity;
      }
    });

    // put all the items to order and orderItems
    const newOrder = await db.order.create({
      data: {
        userId: user.id,
        storeUrl: cart.storeUrl,
        orderItems: {
          createMany: {
            data: cart.cartItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          },
        },
      },
    });

    if (newOrder) {
      // add payment logic here
      await db.payment.create({
        data: {
          orderId: newOrder.orderId,
          amount: Number((subTotal + shipping).toFixed(2)),
          paymentMethod: 'STRIPE',
          status: "SUCCESS",
          transactionId: newOrder.orderId.toString().slice(0, 8) + ':' + v4()
        },
      });

      // clear the cart
      await db.cart.deleteMany({
        where: {
          cartId: cart.cartId,
        },
      });

      return NextResponse.json(
        {
          message: "Order created!",
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    { error: "Could not create order" },
    { status: 500 }
  );
};
