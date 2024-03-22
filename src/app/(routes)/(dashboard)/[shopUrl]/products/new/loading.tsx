import { Skeleton } from "@/components/ui/skeleton";

export default function ProductFormLoading() {
  return (
    <div>
      <div className="grid grid-cols-6 gap-x-4">
        <div className="col-span-4">
          <h1 className="font-bold mb-4">Add Product</h1>
        </div>
        <div className="col-span-2 flex items-center gap-x-2 justify-end">
          <Skeleton className="w-24 h-8 bg-neutral-100" />
        </div>
        <div className="col-span-6 h-10"></div>
        <div className="bg-neutral-100 h-[400px] col-span-4"></div>
        <div className="bg-neutral-100 h-[200px] col-span-2"></div>
      </div>
    </div>
  );
}
