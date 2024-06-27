"use client";

import { useState } from "react";
import Link from "next/link";

import { ChevronLeft, ChevronRight, Languages } from "lucide-react";
import { MailOpen, X } from "../Icons";

import "swiper/css";
import "swiper/css/navigation";

import { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import Container from "../Layout/Container";
import { User } from "./User";


const Announcement = () => {
  const [announcements, setAnnouncements] = useState<string[]>([
    "I can help you to build more reboust app than this one (contact me)",
    "17% off on all products (use code: 50OFF)",
  ]);

  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  const handlePrevious = () => {
    swiperRef?.slidePrev();
  };

  const handleNext = () => {
    swiperRef?.slideNext();
  };

  return (
    <div className="bg-[#1d1d1d] text-white h-10">
      <Container className="grid grid-cols-[auto_auto] md:grid-cols-[27%_46%_27%] h-full">
        <div className="flex items-center gap-x-3">
          <Link href="mailto:yourmail@site.com">
            <MailOpen size={20} />
          </Link>
          <Link href="https://x.com/@my_business">
            <X size={20} />
          </Link>
        </div>

        {/* ANNOUNCEMENT AREA */}
        <div
          className="hidden md:flex items-center"
          aria-label="announcements"
          title="announcement"
        >
          {announcements.length > 1 && (
            <button className="focus:outline-none" onClick={handlePrevious}>
              <ChevronLeft size={20} />
            </button>
          )}
          <Swiper
            onSwiper={setSwiperRef}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Navigation, Autoplay]}
          >
            {announcements.map((announcement, index) => (
              <SwiperSlide className="text-center" key={index} style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                <span className="text-sm">{announcement}</span>
              </SwiperSlide>
            ))}
          </Swiper>
          {announcements.length > 1 && (
            <button className="focus:outline-none" onClick={handleNext}>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
        {/* ANNOUNCEMENT AREA END */}

        <div className="flex items-center justify-end gap-x-6">
          <div className="flex items-center gap-x-2">
            <Languages size={16} />
            <span className="text-sm">English</span>
          </div>
          <div className="flex items-center gap-x-2">
            <User />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Announcement;
