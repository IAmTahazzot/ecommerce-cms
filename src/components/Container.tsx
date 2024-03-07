import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("container max-w-[1024px] p-6 my-0 mx-auto", className)}>
      {children}
    </div>
  );
};
