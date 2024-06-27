import type { Product as ProductProps, Category, Review, Image, Variant } from "@prisma/client";
import ProductCard from "./ProductCard";

export type ProductType = (ProductProps & { category?: Category, Review?: Review[], images: Image[], variants?: Variant[] });
export interface ProductsProps {
  products: ProductType[];
}

export const Products = ({
  products
}: ProductsProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((product) => {
        return <ProductCard key={product.productId} product={product}  />
      })}
    </div>
  )
}