import type { Shop } from "@/components/Header/SwitchShop";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Navigation } from "@/lib/navigations";
import { Header } from "@/components/Header/Header";
import { NotificationPanel } from "@/components/NotificationPanel/NotificationPanel";
import { Main } from "./components/Main";
import { db } from "@/db/db";
import { currentUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/ModalProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const getMyShop = async (): Promise<
  Shop[] | { error: string; description?: string }
> => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized access!",
      description: "Sign in to access your store.",
    };
  }

  try {
    const shops = await db.store.findMany({
      where: {
        userId: user.id,
      },
    });

    if (shops.length === 0) {
      return { error: "No store found." };
    }

    return shops.map((shop) => {
      return {
        id: shop.storeUrl,
        name: shop.storeName,
      };
    });
  } catch (e) {
    return { error: "An error occurred fetching stores!" };
  }
};

interface MainLayoutProps {
  params: {
    shopUrl: string;
  };
  children: React.ReactNode;
}

const MainLayout = async ({ params, children }: MainLayoutProps) => {
  const shops = await getMyShop();

  if ("error" in shops) {
    return (
      <div className="h-screen flex justify-center bg-neutral-50">
        <div className="w-[90%] md:w-[500px] self-start  p-4 my-4 text-neutral-800 border bg-white">
          <h3 className="mb-3 font-bold">{shops.error}</h3>
          <p className="text-xs">
            {shops.description ? (
              shops.description
            ) : (
              <span>
                Please refresh the page or try another time. Signing up again
                may resolve the issue.
              </span>
            )}
          </p>
          <Link href="/">
            <Button variant={"default"} size={"sm"} className="mt-4">
              Back to homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Header shops={shops} activeShopUrl={params.shopUrl} />
        <Sidebar navigation={Navigation} activeShopUrl={params.shopUrl} />
        <Main>{children}</Main>
        <NotificationPanel />
        <Toaster position="bottom-right" />
        <ModalProvider />
      </ThemeProvider>
    </div>
  );
};

export default MainLayout;
