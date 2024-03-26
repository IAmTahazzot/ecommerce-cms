import { currentUser } from "@clerk/nextjs";
import { db } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const profile = await currentUser();

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { storeUrl, storeName } = await req.json();

  const store = await db.store.create({
    data: {
      userId: profile.id,
      storeName: storeName,
      storeUrl,
    },
  });

  return NextResponse.json({ store });
}
