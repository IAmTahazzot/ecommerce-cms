import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
import { cookies } from "next/headers";
import { type CartItemType } from "@/components/Shop/Products/Product";

export const POST = async (request: Request, response: Response) => {
  const body = (await request.json()) as CartItemType;
  const user = await currentUser();

  const myCookies = cookies();
  const sessionId = myCookies.get("sessionId")?.value || v4();

  console.log(sessionId)

  if (!myCookies.get("sessionId") && !user) {
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      secure: true,
    };

    myCookies.set("sessionId", sessionId, cookieOptions);
  }

  const newCartItem = async ({
    cartId,
    productId,
    variantId,
    quantity,
  }: {
    cartId: number;
    productId: number;
    variantId?: number;
    quantity: number;
  }) => {
    const newCartItemData = {
      cartId,
      productId,
      variantId,
      quantity,
    };

    const response = await db.cartItem.create({
      data: newCartItemData,
    });

    const cart = await db.cartItem.findFirst({
      where: {
        cartItemId: response.cartItemId
      },
      include: {
        product: {
          include: {
            images: true
          }
        },
        variant: true
      }
    })

    return cart;
  };

  // check if cart exists
  const existingUserCart = await db.cart.findUnique({
    where: {
      userId: user?.id || "none",
    },
  });

  const existingSessionCart = await db.cart.findUnique({
    where: {
      sessionId: sessionId || "none",
    },
  });

  try {
    // if cart exists, add to cartItem
    if (existingUserCart) {
      const newCartResponse = await newCartItem({
        cartId: existingUserCart.cartId,
        productId: body.product.productId,
        variantId: body.variant?.variantId,
        quantity: body.quantity,
      });

      return NextResponse.json({
        message: "Product has been added to cart",
        data: newCartResponse,
      });
    } else if (existingSessionCart) {
      const newCartResponse = await newCartItem({
        cartId: existingSessionCart.cartId,
        productId: body.product.productId,
        variantId: body.variant?.variantId,
        quantity: body.quantity,
      });

      return NextResponse.json({
        message: "Product has been added to cart",
        data: newCartResponse,
      });
    } else {
      let newCart;

      if (user) {
        const res = await db.cart.create({
          data: {
            userId: user.id,
            storeUrl: body.storeUrl,
          },
        });

        newCart = res;
      } else {
        const res = await db.cart.create({
          data: {
            sessionId: sessionId,
            storeUrl: body.storeUrl,
          },
        });

        newCart = res;
      }

      const response = await newCartItem({
        cartId: newCart.cartId,
        productId: body.product.productId,
        variantId: body.variant?.variantId,
        quantity: body.quantity,
      });

      return NextResponse.json({
        message: "Your first cart has been added",
        data: response,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Error adding to cart",
      error: error 
    })
  }
};

export const PUT = async (request: Request) => {
  const body = (await request.json()) as { id: number; quantity: number };

  try {
    await db.cartItem.update({
      where: {
        cartItemId: body.id,
      },
      data: {
        quantity: body.quantity,
      },
    });

    return NextResponse.json({ message: "Quantity updated" });
  } catch (error) {
    return NextResponse.error();
  }
}

export const DELETE = async (request: Request) => {
  const body = (await request.json()) as { id: number };

  try {
    await db.cartItem.delete({
      where: {
        cartItemId: body.id,
      },
    });

    return NextResponse.json({ message: "Cart deleted" });
  } catch (error) {
    return NextResponse.error();
  }
}