import type { navList } from "@/components/Sidebar/Sidebar";
import { FaCog, FaTag } from "react-icons/fa";
import { TbDashboard } from "react-icons/tb";

export const Navigation: navList[] = [
  {
    title: "Dashboard",
    navItems: [
      {
        name: "Overview",
        href: "/",
        icon: <TbDashboard className="w-5 h-5" />,
      },
      {
        name: "Products",
        href: "/products",
        icon: <FaTag className="w-[17px] h-[17px] rotate-90" />,
        children: [
          {
            name: "Add Product",
            href: "/products/add",
          },
        ],
      },
    ],
  },

  {
    title: "Account Management",
    navItems: [
      {
        name: "Settings",
        href: "/settings",
        icon: <FaCog className="w-[17px] h-[17px]" />,
      },
    ],
  },
];
