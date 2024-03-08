-- AlterTable
CREATE SEQUENCE store_storeid_seq;
ALTER TABLE "Store" ALTER COLUMN "storeId" SET DEFAULT nextval('store_storeid_seq');
ALTER SEQUENCE store_storeid_seq OWNED BY "Store"."storeId";
