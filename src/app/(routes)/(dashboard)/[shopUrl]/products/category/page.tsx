import { db } from "@/db/db";
import { CategoryForm } from "./components/CategoryForm";
import { CategoryTable } from "./components/CategoryTable";
import { columns } from "./components/Columns";

export default async function Category ({ params }: { params: { shopUrl: string }}) {
  const { shopUrl } = params;

  const categories = await db.category.findMany({
    where: {
      storeUrl: shopUrl
    }
  });

  return (
     <div>
        <h1 className='font-bold'>Category</h1>
        <CategoryForm storeUrl={shopUrl} className="mt-10 mb-16"/>
        <CategoryTable columns={columns} data={categories} />
     </div>
  )
}