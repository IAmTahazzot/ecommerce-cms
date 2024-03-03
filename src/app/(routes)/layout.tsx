import { Sidebar } from "@/components/Sidebar/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;