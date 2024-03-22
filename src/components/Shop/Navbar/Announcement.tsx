"use client";

import { ChevronLeft, ChevronRight, Languages } from "lucide-react";
import { MailOpen, X } from "../Icons";
import Container from "../Layout/Container";
import Link from "next/link";
import { useState } from "react";
import { Swiper as SwiperClass } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

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
      <Container className="grid grid-cols-[27%_46%_27%] h-full">
        <div className="flex items-center gap-x-3">
          <Link href="mailto:yourmail@site.com">
            <MailOpen size={24} />
          </Link>
          <Link href="https://x.com/@my_business">
            <X size={24} />
          </Link>
        </div>

        {/* ANNOUNCEMENT AREA */}
        <div
          className="flex items-center"
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
              <SwiperSlide className="text-center" key={index}>
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

        <div className="flex items-center justify-end gap-x-2">
          <div className="flex items-center gap-x-2">
            <Languages size={16} />
            <span className="text-sm">English</span>
          </div>
          <div className="flex items-center ml-5 gap-x-2">
            <Link href="/sign-in" className="text-sm">
              Sign In
            </Link>
            <span> | </span>
            <Link href="/sign-up" className="text-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Announcement;
