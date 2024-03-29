import { db } from "@/db/db";
import { Products } from "@/components/Shop/Products/Products";
import Container from "@/components/Shop/Layout/Container";
import Image from "next/image";
import { Product } from "@/components/Shop/Products/Product";
import { ProductBreadcrumb } from "@/components/Shop/Products/BreadCrumb";

export default async function CategoryPage({
  params,
}: {
  params: { shopUrl: string; productId: string };
}) {
  const product = await db.product.findFirst({
    where: {
      productId: Number(params.productId),
    },
    include: {
      category: true,
      Review: {
        include: {
          user: true,
        }
      },
      images: true,
      variants: true
    },
  });

  if (!product) {
    return (
      <div className="flex items-center justify-center my-10">
        <Image src="/404.gif" alt="404" width={500} height={500} />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <Container>
        <div className="my-8">
          <ProductBreadcrumb
            staticText={product.title}
            list={[
              {
                label: product.category.categoryName,
                url: `/shop/${params.shopUrl}/category/${product.category.categoryUrl}`,
              },
            ]}
          />
        </div>

        <Product product={product} />
      </Container>
    </div>
  );
}
