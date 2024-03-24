"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

interface ProductBreadcrumbProps {
  staticText: string;
  list?: {
    label: string;
    url: string;
  }[];
}

export function ProductBreadcrumb({
  staticText,
  list,
}: ProductBreadcrumbProps) {
  const path = usePathname();
  const shopUrl = "/shop/" + path.split("/")[2];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={shopUrl}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {list && <BreadcrumbSeparator />}

        {list?.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink href={item.url}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{staticText}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
