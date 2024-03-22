import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/providers/ThemeProvider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to UnityShop CMS",
  description: "A sleek CMS crafted from the ground up with Next.js and Prisma for any startup or small business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light">
            {children}
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}