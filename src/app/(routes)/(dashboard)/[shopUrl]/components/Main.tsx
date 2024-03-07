'use client'

import { Container } from "@/components/Container";
import { useLayout } from "@/hooks/useLayout";
import { cn } from "@/lib/utils";

interface MainProps {
  children: React.ReactNode;
}

export const Main = ({ children }: MainProps) => {
  const { sidebar, notificationPanel } = useLayout();

  return (
    <main
      className={cn(
        "transition-all mt-16",
        sidebar ? "ml-[212px]" : "ml-0",
        notificationPanel ? "mr-[270px]" : "mr-0"
      )}
    >
      <Container>{children}</Container>
    </main>
  );
};
