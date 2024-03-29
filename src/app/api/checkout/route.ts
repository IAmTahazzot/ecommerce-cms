import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to checkout" },
      { status: 401 }
    );
  }

  // check if user does have address
  const address = await db.address.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!address) {
    return NextResponse.json(
      { error: "You must have an address to checkout" },
      { status: 400 }
    );
  }

  // check if address is valid
  if (
    !address.addressOne ||
    !address.city ||
    !address.zipcode ||
    !address.country ||
    !address.phoneNumber
  ) {
    return NextResponse.json(
      { error: "You must have a valid address to checkout" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "Clear to checkout!",
    },
    { status: 200 }
  );
};
