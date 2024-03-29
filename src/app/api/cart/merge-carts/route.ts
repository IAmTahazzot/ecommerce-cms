import { db } from "@/db/db"
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  const { userId, sessionId } = await request.json() as { userId: string, sessionId: string }

  try {
    cookies().delete('sessionId');

    await db.cart.updateMany({
      where: {
        sessionId: sessionId
      },

      data: {
        userId: userId,
        sessionId: null
      }
    })

    return NextResponse.json({
      message: 'Carts merged'
    })
  } catch (error ){
    return NextResponse.json({
      message: 'Error merging carts'
    })
  }
}