import { db } from "@/db/db";
import { BillboardForm } from "./components/BillboardForm";

export default async function BillboardPage({
  params,
}: {
  params: { shopUrl: string };
}) {
  const categories = await db.category.findMany({
    where: {
      storeUrl: params.shopUrl,
    }
  })

  return <BillboardForm shopUrl={params.shopUrl} categories={categories} />;
}
