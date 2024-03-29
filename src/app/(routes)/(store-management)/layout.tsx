"use client";

import { VscColorMode } from "react-icons/vsc";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ThemeProvider } from "next-themes";

export default function StoreManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme, theme } = useTheme();

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Container>
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-x-4 text-sm font-medium">
            <Link href="/">Home</Link>
            <ChevronRight size={16} className="opacity-50" />
            <span>Store Management</span>
          </div>

          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            <VscColorMode className="cursor-pointer" size={16} />
          </Button>
        </header>
        <div className="flex items-center justify-center mt-24">{children}</div>
      </Container>
    </ThemeProvider>
  );
}
