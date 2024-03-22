import { create } from "zustand";

export enum ModalType {
  EDIT_CATEGORY = "EDIT_CATEGORY",
  CART = 'STORE_CARTS_PREVIEW',
}

type ModalStoreProps<ModalData> = {
  isOpen: boolean;
  type: ModalType | null;
  data: ModalData;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
};

export const useModal = create<ModalStoreProps<any>>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = {}) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));