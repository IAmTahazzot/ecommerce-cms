import { db } from "@/db/db";
import { Products } from "@/components/Shop/Products/Products";
import Container from "@/components/Shop/Layout/Container";

export default async function CategoryPage({
  params,
}: {
  params: { shopUrl: string; categoryUrl: string };
}) {
  const products = await db.product.findMany({
    where: {
      category: {
        categoryUrl: params.categoryUrl,
      },
      store: {
        storeUrl: params.shopUrl,
      },
    },
    include: {
      category: true,
      Review: true,
      images: true,
    },
  });

  return (
    <div className="mt-5">
      <Container>
        <h1 className="mb-4 font-medium uppercase text-4xl">
          {params.categoryUrl.split("-").join(" ")}
        </h1>
        <div className="my-6">
          {products.length === 0 && <>{<p>No products found</p>}</>}
        </div>
        <Products products={products} />
      </Container>
    </div>
  );
}
