import { ErrorTemplate } from '@/components/Error/ErrorTemplate'
import { EnhancedOrder, columns } from '@/components/Products/Order/Columns'
import { OrderTable } from '@/components/Products/Order/OrderTable'
import { db } from '@/db/db'
import { currentUser } from '@clerk/nextjs'

const Orders = async ({ params }: { params: { shopUrl: string } }) => {
  const store = await db.store.findFirst({
    where: {
      storeUrl: params.shopUrl,
    },
  })

  if (!store) {
    return <ErrorTemplate type={'No store found'} />
  }

  const user = await currentUser()

  if (!user) {
    return <ErrorTemplate type={'Unauthorized'} />
  }

  const orders = await db.order.findMany({
    where: {
      storeUrl: params.shopUrl,
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  }) as EnhancedOrder[];

  return <OrderTable data={orders} columns={columns} />
}

export default Orders
