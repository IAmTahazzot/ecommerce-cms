import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Navigation } from "@/lib/navigations";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar navigation={Navigation} />
      <main className='ml-[212px]'>{children}</main>
    </div>
  );
};

export default MainLayout;