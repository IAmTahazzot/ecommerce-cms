"use client";

import { AddressForm } from "@/app/(routes)/(shop)/shop/[shopUrl]/components/AddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ModalType, useModal } from "@/hooks/useModal";
import { useUser } from "@clerk/nextjs";
import { Address } from "@prisma/client";
import { useEffect, useState } from "react";

export const AddressModal = () => {
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const { isOpen, type, closeModal } = useModal();
  const { isLoaded, user } = useUser();
  const shouldOpen: boolean = isOpen && type === ModalType.ADDRESS;

  useEffect(() => {
    // console.log('address modal')
    // const getAddress = async () => {
    //   const response = await fetch(`/api/address`);
    //   const data = await response.json();

    //   if (response.ok) {
    //     setAddress(data);
    //   }
    // };

    // if (user) {
    //   getAddress();
    // }
  }, []);

  if (!isLoaded) {
    return null
  }

  return (
    <div>
      <Dialog open={shouldOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[425px] lg:max-w-[600px] py-24">
          <div className="flex items-center justify-center">
            <AddressForm address={address} isModal={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
