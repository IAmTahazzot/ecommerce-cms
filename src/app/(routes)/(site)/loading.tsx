import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Container className="max-w-[1200px]">
        <header className="flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-neutral-600" />
          <div className="flex items-center justify-between gap-x-4">
            <Skeleton className="h-8 w-8 bg-neutral-600 rounded-full" />
            <Skeleton className="h-8 w-8 bg-neutral-600 rounded-full" />
            <Skeleton className="h-8 w-8 bg-neutral-600 rounded-full" />
          </div>
        </header>

        <section className="flex flex-col items-center gap-y-4 mt-32 text-center">
          <Skeleton className="h-8 w-48 bg-neutral-600" />
          <Skeleton className="h-16 w-[600px] bg-neutral-600" />
          <div className="h-12"></div>
        </section>

        <section className="mt-32">
          <Skeleton className="h-96 bg-neutral-600" />
        </section>
      </Container>
    </div>
  );
}
