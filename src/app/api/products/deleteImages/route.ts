import { NextResponse } from "next/server";
import { UTApi } from 'uploadthing/server'

export async function POST(request: Request) {
  const body = await request.json();
  const utapi = new UTApi()
  await utapi.deleteFiles([body.imageUrl])

  return NextResponse.json({
    status: 200,
  })
}