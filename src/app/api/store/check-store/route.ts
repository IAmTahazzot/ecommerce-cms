import { currentUser } from '@clerk/nextjs'
import { db } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const profile = await currentUser();

  if (!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { storeUrl } = await req.json();

  const store = await db.store.findUnique({
    where: {
      storeUrl: storeUrl
    }
  })

  if (store) {
    return NextResponse.json({ storeExists: true });
  }

  return NextResponse.json({ storeExists: false });
}