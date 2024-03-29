import { db } from "@/db/db";
import { BillboardForm } from "../new/components/BillboardForm";
import { BillboardProps } from "@/components/Products/Billboard/Columns";

export default async function BillboardPage({ params, }: { params: { billboardId: string; shopUrl: string }; }) {
  const categories = await db.category.findMany({
    where: {
      storeUrl: params.shopUrl,
    },
  });

  const billboard  = await db.billBoard.findUnique({
    where: {
      id: parseInt(params.billboardId),
    },
    include: {
      category: true,
    }
  })

  return <BillboardForm shopUrl={params.shopUrl} categories={categories} billboard={billboard || undefined} />;
}