import type { navList } from "@/components/Sidebar/Sidebar";

import { FaCog, FaTag } from "react-icons/fa";
import { TbDashboard } from "react-icons/tb";
import { GoInbox } from "react-icons/go";
import { CiViewBoard } from "react-icons/ci";

// [WARNING]: Currently, the Sidebar component only supports one level of nesting. So, DO NOT ATTMEPT TO ADD MORE THAN ONE LEVEL OF NESTING or it will break the UI.
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
        icon: <FaTag className="h-4 w-4 rotate-90" />,
        children: [
          {
            name: "Add Product",
            href: "/products/new",
          },
          {
            name: "Inventory",
            href: "/products/inventory",
          },
          {
            name: "Category",
            href: "/products/category",
          },
        ],
      },
      {
        name: "Billboard",
        href: "/billboard",
        icon: <CiViewBoard className="w-5 h-5" />, 
      },
      {
        name: "Orders",
        href: "/orders",
        icon: <GoInbox className="h-4 w-4" />,
      }
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
