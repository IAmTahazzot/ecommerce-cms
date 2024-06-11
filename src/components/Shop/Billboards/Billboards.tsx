"use client";

import { useRef, useState } from "react";
import { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BillBoard, Category } from "@prisma/client";
import { Billboard } from "./Billboard";
import { BillboardProps } from "./Billboard";

interface BillBoardsProps {
    billboards: (BillBoard & { category: Category })[];
}

const Billboards = ({ billboards }: BillBoardsProps) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const swiperPaginationRef = useRef<HTMLDivElement>(null);
  const swiperNavigationNext = useRef<HTMLButtonElement>(null);
  const swiperNavigationPrev = useRef<HTMLButtonElement>(null);

  const calculateTimeLeft = (s: any, time: number, progress: number) => {
    document.body?.style.setProperty(
      "--swiperProgress",
      (100 - progress * 100).toString().concat("%")
    );
  };

  const billboardsTransformed: BillboardProps[] = billboards.map((billboard) => ({
    data: {
      id: (billboard.id).toString(),
      label: billboard.title,
      subTitle: billboard.subtitle,
      imageUrl: billboard.imageUrl,
      categoryUrl: billboard.category.categoryUrl,
    },
  }));

  return (
    <div>
      <Swiper
        className="h-[500px]"
        onSwiper={setSwiperRef}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: swiperNavigationNext.current,
          prevEl: swiperNavigationPrev.current,
        }}
        pagination={{
          clickable: true,
          el: swiperPaginationRef.current,
          bulletActiveClass: "Custom_swiperActiveBullet",
          bulletClass: "Custom_SwiperBullet",
          renderBullet: function (index, className) {
            return '<div class="' + className + '"></div>';
          },
        }}
        onAutoplayTimeLeft={calculateTimeLeft}
        modules={[Navigation, Autoplay, Pagination]}
      >
        {billboardsTransformed.map((billboard) => (
          <SwiperSlide key={billboard.data.id}>
            <Billboard data={billboard.data} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center gap-x-4 mt-10">
        <button ref={swiperNavigationPrev} className="disabled:opacity-20">
          <ChevronLeft size={18} />
        </button>
        <div
          className="flex items-center gap-x-1 justify-center !w-auto"
          aria-label="🎮🎛️ control pagination for billboard slider"
          ref={swiperPaginationRef}
        ></div>
        <button ref={swiperNavigationNext} className="disabled:opacity-20">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Billboards;
