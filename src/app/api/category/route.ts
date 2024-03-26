import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (!body.categoryName) {
    return NextResponse.json({
      message: "Category name is required",
      status: 400,
    });
  }

  if (!body.storeUrl) {
    return NextResponse.json({
      message: "Store URL is required",
      status: 400,
    })
  }

  try {
    const newCategory = await db.category.create({
      data: {
        categoryName: body.categoryName,
        categoryUrl: body.categoryName.split(" ").join("-").toLowerCase(),
        storeUrl: body.storeUrl
      },
    });

    return NextResponse.json({
      data: newCategory,
      message: "Category has been created",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error creating category",
      status: 500,
    });
  }

}

export const PATCH = async (request: Request) => {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (!body.categoryId) {
    return NextResponse.json({
      message: "Category ID is required",
      status: 400,
    });
  }

  if (!body.categoryName) {
    return NextResponse.json({
      message: "Category name is required",
      status: 400,
    });
  }

  try {
    await db.category.update({
      where: {
        categoryId: body.categoryId,
      },
      data: {
        categoryName: body.categoryName,
        categoryUrl: body.categoryName.split(" ").join("-").toLowerCase(),
      },
    });

    return NextResponse.json({
      message: "Category has been updated",
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Unable to update category',
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  if (!body.categoryId) {
    return NextResponse.json({
      message: "Category ID is required",
      status: 400,
    });
  }

  try {
    await db.category.delete({
      where: {
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json({
      message: "Category has been deleted",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Unable to delete category",
      status: 500,
    });
  }
}