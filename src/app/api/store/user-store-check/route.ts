import { currentUser } from "@clerk/nextjs";
import { db } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const profile = await currentUser();
  const data = await req.json();
  const storeUrl = data.storeUrl;

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (storeUrl) {
    const store = await db.store.findUnique({
      where: {
        storeUrl: storeUrl,
        userId: profile.id,
      },
    });

    if (store) {
      return NextResponse.json({
        ...store,
      });
    }
  } else {
    const store = await db.store.findFirst({
      where: {
        userId: profile.id,
      },
    });

    if (store) {
      return NextResponse.json({
        ...store,
      });
    }
  }

  return NextResponse.json({
    storeUrl: false,
  });
}
