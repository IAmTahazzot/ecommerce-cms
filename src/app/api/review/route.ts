import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const DELETE = async (request: Request) => {
  const user = await currentUser();
  const { reviewId } = (await request.json()) as { reviewId: number };

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }

  if (!reviewId) {
    return NextResponse.json({ message: "Review ID is required", status: 400 });
  }

  try {
    const response = await db.review.deleteMany({
      where: {
        reviewId: reviewId,
      },
    });

    if (!response) {
      return NextResponse.json({ message: "Review not found", status: 404 });
    }

    return NextResponse.json({ message: "Review deleted", status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
};

export const POST = async (request: Request) => {
  const user = await currentUser();
  const { productId, rating, comment } = (await request.json()) as {
    productId: number;
    rating: string;
    comment: string;
  };

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }

  if (!productId || !rating || !comment) {
    return NextResponse.json({
      message: "All fields are required",
      status: 400,
    });
  }

  try {
    const response = await db.review.create({
      data: {
        productId,
        message: comment,
        userId: user.id,
        reviewLevel: rating,
      },
    });

    if (!response) {
      throw new Error("Unable to create review");
    }

    return NextResponse.json({ message: "Review created", status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
};
