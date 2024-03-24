import Billboards from "@/components/Shop/Billboards/Billboards";
import Container from "@/components/Shop/Layout/Container";
import Product from "@/components/Shop/Products/ProductCard";
import { Products } from "@/components/Shop/Products/Products";
import { db } from "@/db/db";

export default async function Shop({
  params,
}: {
  params: { shopUrl: string };
}) {

  const billboards = await db.billBoard.findMany({
    where: {
      storeUrl: params.shopUrl,
    },
    include: {
      category: true
    }
  })

  const products = await db.product.findMany({
    where: {
      store: {
        storeUrl: params.shopUrl
      }
    },

    include: {
      category: true,
      Review: true,
      images: true
    }
  })

  return (
    <div>
      <Billboards billboards={billboards} />

      <Container>
        <h1 className='mb-4 font-semibold'>All products</h1>

        {products.length === 0 && <>{<p>No products found</p>}</>}
        <Products products={products} />
      </Container>
    </div>
  );
}
