'use client'

import { cn } from "@/lib/utils";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useLayout } from "@/hooks/useLayout";


export type navItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: navItem[];
};

export type navList = {
  title: string;
  navItems: navItem[];
};

interface SidebarProps {
  navigation?: navList[];
}

/**
 * 
 * @Component Sidebar
 * 
 * @description
 * This component is a sidebar navigation component that displays a list of navigation items.
 * It also supports submenus for each navigation item, [WARNING]: However, it only supports one level of nesting.
 * 
 * @todo
 * - Add infinite nesting for submenus
 */
export const Sidebar = ({ navigation }: SidebarProps) => {
  const path = usePathname();
  const [activeRoot, setActiveRoot] = useState<number | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const { sidebar }  = useLayout();

  const handleSubMenu = (rootIndex: number, index: number) => {
    setActiveRoot(rootIndex);
    setActiveSubmenu(index === activeSubmenu ? null : index);
  };

  return (
    <aside className={
      cn(
        'fixed top-0 flex flex-col w-[212px] h-full p-4 z-10 bg-white border-r border-neutral-200 transition-transform',
        sidebar ? 'translate-x-0' : '-translate-x-full'
      )
    }>
      <div className="flex items-center gap-x-2 h-8 mb-4">
        <Image
          src="/placeholders/avatar.png"
          alt="Avatar"
          width={24}
          height={24}
          className="rounded-full object-fill"
        />
        <h3 className="font-medium text-sm">Sarah</h3>
      </div>

      <div className="flex flex-col gap-y-8 mt-6">
        {navigation?.map((nav, rootIndex) => (
          <div key={rootIndex}>
            <h3 className="text-[13px] text-neutral-400">{nav.title}</h3>

            <ul className="space-y-2 my-2">
              {nav.navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-x-2 h-8 text-sm text-neutral-900 px-2 rounded-lg",
                      path === item.href ? "bg-neutral-100" : ""
                    )}
                  >
                    {item.children ? (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubMenu(rootIndex, index);
                        }}
                        className="h-5 w-5 grid items-center justify-center"
                      >
                        {activeSubmenu === index && activeRoot === rootIndex ? (
                          <MdKeyboardArrowDown className="w-5 h-5" />
                        ) : (
                          <MdKeyboardArrowRight className="w-5 h-5" />
                        )}
                      </div>
                    ) : (
                      <div className="h-5 w-5 grid items-center justify-center"></div>
                    )}

                    <div
                      className={cn("h-5 w-5 grid items-center justify-center")}
                    >
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </Link>

                  {item.children && (
                    <ul
                      className={cn(
                        "space-y-2 my-2",
                        activeSubmenu === index && activeRoot === rootIndex
                          ? "block"
                          : "hidden"
                      )}
                    >
                      {item.children.map((child, index) => (
                        <li key={index}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-x-2 h-8 pl-16 text-sm text-neutral-900 rounded-lg",
                              path === child.href ? "bg-neutral-100" : ""
                            )}
                          >
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};
