/*
  Warnings:

  - You are about to drop the column `streetAddress` on the `Address` table. All the data in the column will be lost.
  - Added the required column `addressOne` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "streetAddress",
ADD COLUMN     "addressOne" TEXT NOT NULL,
ADD COLUMN     "addressTwo" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
