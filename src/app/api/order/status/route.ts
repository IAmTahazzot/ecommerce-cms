import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/db/db'
import { OrderStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = async (request: NextRequest) => {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to checkout' }, { status: 401 })
  }

  const { orderId, status } = (await request.json()) as { orderId: number; status: OrderStatus }

  if (!orderId || !status) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    // update order status
    const order = await db.order.update({
      where: {
        orderId,
      },
      data: {
        status,
      },
    })

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
