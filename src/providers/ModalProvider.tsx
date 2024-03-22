import { CategoryEditModal } from "@/components/Modals/CategoryEditModal";
import CartModal from "@/components/Shop/Modals/CartModal";

export const ModalProvider = () => {
  return (
    <>
      <CategoryEditModal />
      <CartModal />
    </>
  );
};
