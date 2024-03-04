import { PiSidebarDuotone } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { VscColorMode } from 'react-icons/vsc'

import { Shop, SwitchShop } from "./SwitchShop";
import { Button } from "../ui/button";
import { SearchCommands } from "./SearchCommands";

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

export const Header = async () => {
  const shops = await getMyShop();

  return (
    <header className="fixed top-0 left-[212px] right-[270px] py-4 px-6 border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-between h-[32px]">
        <div className="flex items-center gap-x-2">
          <Button variant={"ghost"} size={"icon"}>
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
          <Button variant={"ghost"} size={"icon"}>
            <PiSidebarDuotone className="h-5 w-5 rotate-180" />
          </Button>
        </div>
      </div>
    </header>
  );
};
