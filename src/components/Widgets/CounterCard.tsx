import { cn } from "@/lib/utils";

interface CounterCardProps {
  title: string;
  counter: number;
  currency?: string | React.ReactNode;
  details?: React.ReactNode;
  className?: string;
}

export const CounterCard = ({
  title,
  counter,
  currency,
  details,
  className,
}: CounterCardProps) => {
  return (
    <div className={cn("p-6 space-y-2 rounded-lg bg-neutral-100 dark:bg-neutral-900", className)}>
      <h2 className="text-xs font-normal">{title}</h2>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold">
          {currency}
          {counter}
        </h1>
        <div>{details}</div>
      </div>
    </div>
  );
};
