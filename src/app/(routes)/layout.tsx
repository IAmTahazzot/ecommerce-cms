import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Navigation } from "@/lib/navigations";
import { Header } from "@/components/Header/Header";
import { NotificationPanel } from "@/components/NotificationPanel/NotificationPanel";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Sidebar navigation={Navigation} />
      <main className='ml-[212px]'>{children}</main>
      <NotificationPanel />
    </div>
  );
};

export default MainLayout;