import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProducts () {
  return (
    <div>
      <div>
        <div className="mb-3 flex items-center justify-between h-8">
          <Skeleton className="w-[250px] h-full bg-neutral-100 dark:bg-neutral-800" />
          <div className="flex items-center justify-between gap-x-2 h-full">
            <Skeleton className="w-8 h-full bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-[120px] h-full bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>

        <div className='border border-neutral-200 dark:border-neutral-800 rounded'>
          <div className='flex items-center gap-x-2 p-3 border-b border-neutral-200 dark:border-neutral-800'>
            <Skeleton className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-[250px] h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-20 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-20 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-20 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-20 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
          <div className='flex items-center gap-x-2 p-3 border-b border-neutral-200 dark:border-neutral-800'>
            <Skeleton className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className='w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800' />
            <Skeleton className='w-[200px] h-3 rounded-lg bg-neutral-100 dark:bg-neutral-800' />
          </div>
          <div className='flex items-center gap-x-2 p-3'>
            <Skeleton className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800" />
            <Skeleton className='w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800' />
            <Skeleton className='w-[200px] h-3 rounded-lg bg-neutral-100 dark:bg-neutral-800' />
          </div>
        </div>
      </div>
    </div>
  )
}