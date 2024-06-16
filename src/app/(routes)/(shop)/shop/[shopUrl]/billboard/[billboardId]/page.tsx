import { Products } from '@/components/Shop/Products/Products'
import { db } from '@/db/db'
import Image from 'next/image'
import Link from 'next/link'

export default async function BillboardPage({
  params,
}: {
  params: { shopUrl: string; billboardId: string }
}) {
  if (/^\d+$/.test(params.billboardId) === false) {
    return <div className="text-center px-11 my-5">Invalid Billboard ID</div>
  }

  const data = await db.billBoard.findUnique({
    where: {
      id: Number(params.billboardId),
    },

    include: {
      category: {
        include: {
          products: {
            include: {
              category: true,
              variants: true,
              images: true,
              Review: true,
            },
          },
        },
      },
    },
  })

  if (!data) {
    return <div className="text-center px-11 my-5">Billboard not found</div>
  }

  return (
    <div className="my-5 px-11">
      <div className="relative w-full h-[60vh] lg:h-[500px] mb-10">
        <div className="flex flex-col items-center space-y-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <p className="text-[20px]">{data.subtitle}</p>
          <h1 className="text-7xl font-medium text-[#1d1d1d]">{data.title}</h1>
        </div>
        <Image
          className="pointer-events-none object-cover z-[-1] rounded-lg"
          fill
          priority={true}
          src={`https://utfs.io/f/${data.imageUrl}`}
          alt={data.title}
        />
      </div>

      <h1 className="font-bold text-xl mb-7">{data.title} products:</h1>

      {data?.category?.products && (
        <Products products={data.category.products} />
      )}
    </div>
  )
}
