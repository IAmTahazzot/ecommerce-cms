import { VariantProps } from "@/components/Products/Inventory/Columns";
import { columns } from '@/components/Products/Inventory/Columns'
import { Category, Image, Product, Variant }  from '@prisma/client'
import { InventoryTable } from "@/components/Products/Inventory/InventoryTable";
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

  type VariantProps = Product & { images: Image[], category: Category, variants: Variant[] }
  const products: VariantProps[] = await db.product.findMany( {
    where: {
      storeId: store.storeId
    },
    include: {
      images: true,
      category: true,
      variants: true
    }
  })

  type variantsDataProps = Variant & { title: string, images: Image[], category: Category }

  const variants: variantsDataProps[] = []

  products.forEach(product => {
    product.variants.forEach(variant => {
      variants.push({
        ...variant,
        title: product.title,
        images: product.images,
        category: product.category
      })
    })
  })

  return (
    <div>
      <InventoryTable columns={columns} data={variants} />
    </div>
  );
};

export default ProductPage;