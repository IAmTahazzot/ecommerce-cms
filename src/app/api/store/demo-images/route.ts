import { currentUser } from "@clerk/nextjs";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(req: Request) {
  const profile = await currentUser();
  const { productsId } = await req.json();
  const upload = new UTApi();
  const SITE_URL = process.env.SITE_URL;

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!productsId) {
    return new NextResponse("Product ID is required", { status: 400 });
  }

  const responseOne: { data: { key: string } }[] =
    (await upload.uploadFilesFromUrl([
      SITE_URL + "/demo/sneaker.jpg",
      SITE_URL + "/demo/sneaker-white.jpg",
      SITE_URL + "/demo/sneaker-black.jpg",
    ])) as any as { data: { key: string } }[];

  const responseTwo: { data: { key: string } }[] =
    (await upload.uploadFilesFromUrl([
      SITE_URL + "/demo/dragon-fruit.png",
    ])) as any as { data: { key: string } }[];

  const images = await db.image.createMany({
    data: [
      { productId: productsId[0], imageUrl: responseOne[0].data.key },
      { productId: productsId[0], imageUrl: responseOne[1].data.key },
      { productId: productsId[0], imageUrl: responseOne[2].data.key },
      { productId: productsId[1], imageUrl: responseTwo[0].data.key },
    ],
  });

  return NextResponse.json({ images });
}
