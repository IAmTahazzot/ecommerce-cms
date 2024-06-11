"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BillboardProps {
  data: {
    id: string;
    label: string;
    subTitle: string;
    imageUrl: string;
    categoryUrl: string;
  };
}

export const Billboard: React.FC<BillboardProps> = ({
  data: { id, label, subTitle, imageUrl, categoryUrl },
}) => {
  const path = usePathname();

  // for accuracy, to get the shop Name in client side
  const segments = path.split("/").filter((segment) => segment !== "");
  const shopIndex = segments.findIndex((segment) => segment === "shop") + 1;
  const shopUrl = segments[shopIndex];

  return (
    <div className="h-full w-full relative flex items-center justify-center">
      <div className="z-10 flex flex-col items-center space-y-10">
        <p className="text-[20px]">{subTitle}</p>
        <h1 className="text-7xl font-medium text-[#1d1d1d]">{label}</h1>
        <Link
          className="rounded-full py-4 px-12 bg-black text-white hover:bg-zinc-900 text-xl uppercase font-medium"
          href={`/shop/${shopUrl}/billboard/${id}`}
        >
          Shop now
        </Link>
      </div>
      <Image
        className="pointer-events-none object-cover z-0"
        fill
        priority={false}
        src={`https://utfs.io/f/${imageUrl}`}
        alt={label}
      />
    </div>
  );
};
