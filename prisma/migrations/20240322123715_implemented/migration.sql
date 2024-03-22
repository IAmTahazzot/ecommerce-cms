/*
  Warnings:

  - Added the required column `storeUrl` to the `BillBoard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillBoard" ADD COLUMN     "storeUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BillBoard" ADD CONSTRAINT "BillBoard_storeUrl_fkey" FOREIGN KEY ("storeUrl") REFERENCES "Store"("storeUrl") ON DELETE RESTRICT ON UPDATE CASCADE;
