import type { Shop } from "@/components/Header/SwitchShop";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Navigation } from "@/lib/navigations";
import { Header } from "@/components/Header/Header";
import { NotificationPanel } from "@/components/NotificationPanel/NotificationPanel";
import { Main } from "./components/Main";

const getMyShop = async (): Promise<Shop[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "1", name: "Shop 1" },
        { id: "2", name: "Shop 2" },
        { id: "3", name: "Shop 3" },
      ]);
    }, 2000);
  });
};

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const shops = await getMyShop();

  return (
    <div>
      <Header shops={shops} />
      <Sidebar navigation={Navigation} />
      <Main>{children}</Main>
      <NotificationPanel />
    </div>
  );
};

export default MainLayout;