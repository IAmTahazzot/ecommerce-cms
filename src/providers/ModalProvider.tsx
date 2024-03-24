"use client";

import { CategoryEditModal } from "@/components/Modals/CategoryEditModal";
import CartModal from "@/components/Shop/Modals/CartModal";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

export const ModalProvider = () => {
  const { isOpen, closeModal } = useModal();
  return (
    <>
      <div className="relative z-100">
        <CategoryEditModal />
        <CartModal />
      </div>

    {/* Modal overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-[99] transition-opacity duration-300",
          isOpen ? "block" : "hidden"
        )}
        onClick={closeModal}
      ></div>
    </>
  );
};
