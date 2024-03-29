import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const address = await db.address.findUnique({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json(address);
}

export const POST = async (request: Request) => {
  const user = await currentUser();
  const body = (await request.json()) as {
    addressOne: string;
    addressTwo: string;
    city: string;
    state: string;
    phoneNumber: string;
    zip: string;
    country: string;
  };

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.addressOne || !body.city || !body.country || !body.zip) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const isExist = await db.address.findUnique({
    where: {
      userId: user.id,
    },
  });

  try {
    if (isExist) {
      const newAddress = await db.address.update({
        where: {
          userId: user.id,
        },
        data: {
          userId: user.id,
          addressOne: body.addressOne,
          addressTwo: body.addressTwo,
          city: body.city,
          state: body.state,
          phoneNumber: body.phoneNumber,
          country: body.country,
          zipcode: body.zip,
        },
      });

      return NextResponse.json(newAddress);
    } else {
      const newAddress = await db.address.create({
        data: {
          userId: user.id,
          addressOne: body.addressOne,
          addressTwo: body.addressTwo,
          city: body.city,
          state: body.state,
          phoneNumber: body.phoneNumber,
          country: body.country,
          zipcode: body.zip,
        },
      });

      return NextResponse.json(newAddress);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error },
      { status: 500 }
    );
  }
};
