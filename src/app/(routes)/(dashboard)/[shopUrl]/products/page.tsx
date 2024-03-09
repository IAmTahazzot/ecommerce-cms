import { ProductProps, columns } from "@/components/Products/Columns";
import { Product }  from '@prisma/client'
import { ProductsTable } from "@/components/Products/ProductsTable";
import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { ErrorTemplate } from "@/components/Error/ErrorTemplate";

const ProductPage = async ({ params }: {params: { shopUrl: string }}) => {
  const store = await db.store.findFirst({
    where: {
      storeUrl: params.shopUrl
    }
  });

  if (!store) {
    return (
      <ErrorTemplate type={'No store found'} />
    )
  }

  const user = await currentUser();

  if (!user) {
    return (
      <ErrorTemplate type={'Unauthorized'} />
    )
  }

  const products: ProductProps[] = await db.product.findMany( {
    where: {
      storeId: store.storeId
    },
    include: {
      images: true,
      category: true
    }
  })

  return (
    <div>
      <ProductsTable columns={columns} data={products} />
    </div>
  );
};

export default ProductPage;
