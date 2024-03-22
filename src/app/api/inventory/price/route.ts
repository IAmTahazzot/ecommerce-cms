import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (!body.variantId) {
    return NextResponse.json({
      message: "Variant id is required",
      status: 400,
    });
  }

  if (!body.price) {
    return NextResponse.json({
      message: "Inventory is required",
      status: 400,
    });
  }

  try {
    await db.variant.update({
      where: {
        variantId: body.variantId,
      },
      data: {
        price: Number(body.price),
      },
    });

    return NextResponse.json({
      message: "Product price updated",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error updating price",
      status: 500,
    });
  }
};
