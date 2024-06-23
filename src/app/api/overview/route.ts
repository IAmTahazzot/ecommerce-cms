import { db } from '@/db/db'
import { OrderStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const shopUrl = searchParams.get('shopUrl') || ''

  try {
    const data: {
      stats: {
        sales: number
        customers: number
        orders: number
        revenue: number
      }
      sales: number[]
    } = {
      stats: {
        sales: 0,
        customers: 0,
        orders: 0,
        revenue: 0,
      },
      sales: [],
    }

    // Get the current year
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    // Set the start and end dates for the current year
    const startDate = new Date(currentYear, 0, 1) // January 1st of the current year
    const endDate = new Date(currentYear + 1, 0, 1) // January 1st of the next year

    // sales count (for months)
    const orders = await db.order.findMany({
      where: {
        storeUrl: shopUrl,
        //status: OrderStatus.DELIVERED, // only count delivered orders
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    const customers = new Set<string>()

    orders.forEach((order) => {
      const orderMonth = new Date(order.createdAt).getMonth()

      // increment the orders count
      data.stats.orders += 1

      // increment the sales for this months
      let total = order.orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0
      const VAT = 15

      if (total !== 0) {
        total += VAT
      }

      if (currentMonth === orderMonth) {
        data.stats.sales += total
      }

      // for sales chart (whole year data)
      data.sales[orderMonth] = (data.sales[orderMonth] || 0) + total

      // increment the customers count (unique customers)
      customers.add(order.userId)
    })

    // set the customers count
    data.stats.customers = customers.size

    // figure out the revenue
    const totalSales = data.sales.reduce((acc, sales) => acc + sales, 0)
    data.stats.revenue = totalSales - totalSales * 0.15

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'oh oh, I think I lost my way' }, { status: 500 })
  }
}
