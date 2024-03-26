import { currentUser } from "@clerk/nextjs";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(req: Request) {
  const profile = await currentUser();
  const { productId } = await req.json();
  const upload = new UTApi();
  const SITE_URL = process.env.SITE_URL;

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!productId) {
    return new NextResponse("Product ID is required", { status: 400 });
  }

  const response: { data: { key: string } }[] =
    (await upload.uploadFilesFromUrl([
      SITE_URL + "/demo/sneaker.jpg",
      SITE_URL + "/demo/sneaker-white.jpg",
      SITE_URL + "/demo/sneaker-black.jpg",
    ])) as any as { data: { key: string } }[];

  const images = await db.image.createMany({
    data: [
      { productId, imageUrl: response[0].data.key },
      { productId, imageUrl: response[1].data.key },
      { productId, imageUrl: response[2].data.key },
    ],
  });

  return NextResponse.json({ images });
}
