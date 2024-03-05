'use client'

import { PiSidebarDuotone } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { VscColorMode } from 'react-icons/vsc'

import { Shop, SwitchShop } from "./SwitchShop";
import { Button } from "../ui/button";
import { SearchCommands } from "./SearchCommands";
import { useLayout } from "@/hooks/useLayout";
import { cn } from "@/lib/utils";


interface HeaderProps {
  shops: Shop[];
}

export const Header = ({ shops } : HeaderProps) => {
  const { notificationPanel, toggleNotificationPanel, sidebar, toggleSidebar } = useLayout();

  return (
    <header className={
      cn(
        'fixed top-0 py-4 px-6 z-[100] border-b border-neutral-200 bg-white transition-all',
        notificationPanel ? 'right-[270px]' : 'right-0',
        sidebar ? 'left-[212px]' : 'left-0',
      )
    }>
      <div className="flex items-center justify-between h-[32px]">
        <div className="flex items-center gap-x-2">
          <Button onClick={toggleSidebar} variant={"ghost"} size={"icon"}>
            <PiSidebarDuotone className="h-5 w-5" />
          </Button>
          <SwitchShop shops={shops} />
        </div>
        <div className="flex items-center">
          <div className='mr-4'>

          <SearchCommands />
          </div>
          <Button variant={"ghost"} size={"icon"}>
            <IoMdNotificationsOutline className="h-5 w-5" />
          </Button>
          <Button variant={"ghost"} size={"icon"}>
            <VscColorMode className="h-[18px] w-[18px] rotate-45" />
          </Button>
          <Button onClick={toggleNotificationPanel} variant={"ghost"} size={"icon"}>
            <PiSidebarDuotone className="h-5 w-5 rotate-180" />
          </Button>
        </div>
      </div>
    </header>
  );
};
