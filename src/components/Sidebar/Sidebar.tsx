'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from 'next/navigation'

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

export const Sidebar = ({ navigation }: SidebarProps) => {
  const path = usePathname();

  return (
    <aside className="fixed flex flex-col w-[212px] h-full p-4 z-10 bg-white border-r border-neutral-200">
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
        {navigation?.map((nav, index) => (
          <div key={index}>
            <h3 className="text-[13px] text-neutral-400">{nav.title}</h3>

            <ul className="space-y-2 my-2">
              {nav.navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-x-2 h-8 text-sm text-neutral-900 px-2 rounded-lg",
                      path === item.href ? "bg-neutral-100 font-medium" : ""
                    )}
                  >
                    <div className="h-5 w-5 grid items-center justify-center">
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </a>

                  {item.children && (
                    <ul className="ml-7 space-y-2 my-2">
                      {item.children.map((child, index) => (
                        <li key={index}>
                          <a
                            href={child.href}
                            className={cn(
                              "flex items-center gap-x-2 h-8 text-sm text-neutral-900 px-2 rounded-lg",
                              path === child.href
                                ? "bg-neutral-100 font-medium"
                                : ""
                            )}
                          >
                            <span>{child.name}</span>
                          </a>
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
