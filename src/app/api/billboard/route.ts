import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const user = await currentUser();
  const { autoImage } = body;
  const upload = new UTApi();
  const SITE_URL = process.env.SITE_URL;

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  // if autoImage available create an image here instead of the client
  if (autoImage) {
    const response: { data: { key: string } }[] =
      (await upload.uploadFilesFromUrl([SITE_URL + autoImage])) as any as {
        data: { key: string };
      }[];

    body.imageUrl = response[0].data.key;
  }


  try {
    await db.billBoard.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        categoryId: body.categoryId,
        storeUrl: body.shopUrl,
      },
    });

    return NextResponse.json({
      message: "Billboard has been created",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error creating billboard",
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  const body = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
    });
  }

  try {
    await db.billBoard.update({
      where: {
        id: body.billboardId,
      },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json({
      message: "Billboard has been updated",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Unable to update billboard",
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

  try {
    await db.billBoard.delete({
      where: {
        id: body.billboardId,
      },
    });

    return NextResponse.json({
      message: "Billboard has been deleted",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Unable to delete billboard",
      status: 500,
    });
  }
};
