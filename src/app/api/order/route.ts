import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to checkout" },
      { status: 401 }
    );
  }

  try {
    // get order
    const orders = await db.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true
              }
            },
            variant: true,
          },
        },
        Payment: true
      },
    });

    if (orders) {
      return NextResponse.json({ orders }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  const user = await currentUser();
  const { orderId } = await request.json() as { orderId: number};

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to checkout" },
      { status: 401 }
    );
  }

  try {
    // delete order
    const order = await db.order.delete({
      where: {
        orderId: orderId
      },
    });

    if (order) {
      return NextResponse.json({ order }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}