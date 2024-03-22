import { BillBoardTable } from "@/components/Products/Billboard/BillBoardTable";
import { columns } from "@/components/Products/Billboard/Columns";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import Link from "next/link";

export default async function BillboardPage({
  params,
}: {
  params: { shopUrl: string };
}) {
  const billboards = await db.billBoard.findMany({
    where: {
      storeUrl: params.shopUrl,
    },
    include: {
      category: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold">Billboards</h1>
        <Link href="billboard/new">
          <Button variant="default" size="sm">
            Add New Billboard
          </Button>
        </Link>
      </div>

      <div className="mt-5">
        <BillBoardTable columns={columns} data={billboards} />
      </div>
    </div>
  );
}
