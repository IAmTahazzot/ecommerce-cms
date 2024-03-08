import { Product, columns } from "@/components/Products/Columns";
import { ProductsTable } from "@/components/Products/ProductsTable";

async function getProducts(): Promise<Product[]> {
  return [
    {
      id: "1",
      name: "My Watch",
      imageUrl: "a.webp",
      price: 100,
      inventory: 10,
      status: "Active",
      category: "Apple watch",
    },
    {
      id: "2",
      name: "Watch 2",
      imageUrl: "b.avif",
      price: 300,
      inventory: 30,
      status: "Inactive",
      category: "Fashion",
    },
  ];
}

const ProductPage = async () => {
  const products = await getProducts();

  return (
    <div>
      <ProductsTable columns={columns} data={products} />
    </div>
  );
};

export default ProductPage;
