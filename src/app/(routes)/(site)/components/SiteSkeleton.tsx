import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const SiteSkeleton = () => {
  return (
    <Container className="max-w-[1200px]">
      <header className="flex items-center justify-between">
        <Skeleton className="w-36 h-8 bg-slate-100" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="w-20 h-8 bg-slate-100" />
          <Skeleton className="w-20 h-8 bg-slate-100" />
          <Skeleton className="w-8 h-8 rounded-full bg-slate-100" />
        </div>
      </header>

      <section className="flex flex-col gap-y-4 mt-32 text-center">
        <Skeleton className="w-[300px] h-8 bg-slate-100 rounded-full mx-auto" />
        <Skeleton className="w-96 h-16 bg-slate-100 rounded-lg mx-auto" />
      </section>
      <div className="fixed w-full left-0 bottom-10 text-center text-xs text-slate-600">
        <span>One must wait to see the magic happen</span>
      </div>
    </Container>
  );
};
