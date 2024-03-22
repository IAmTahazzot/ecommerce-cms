import Footer from "@/components/Shop/Footer/Footer";
import Header from "@/components/Shop/Navbar/Header";
import { ModalProvider } from "@/providers/ModalProvider";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: { shopUrl: string }
}

const StoreLayout = ({ children, params: { shopUrl } } : StoreLayoutProps) => {
  return (
      <>
          <Header shopUrl={shopUrl} />
            {children}
          <Footer />
          <ModalProvider />
      </>
  )
}

export default StoreLayout;