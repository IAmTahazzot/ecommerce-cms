"use client";

import React, { useEffect, useState } from "react";
import Container from "../Layout/Container";
import NavbarMenu from "./NavMenu";
import { cn } from "@/lib/utils";

const Nav = ({ categories }: { categories: any }) => {
  return (
    <div className='border-b-[1px]'>
      <Container className="flex h-20 items-center">
        <NavbarMenu data={categories} />
      </Container>
    </div>
  );
};

export const StickyNav = ({ categories }: { categories: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;

      if (currentPosition > 200 && currentPosition < prevScrollPos) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setPrevScrollPos(currentPosition);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <div
      aria-label="🪝🧲 sticky navbar"
      className={cn(
        "flex h-20 items-center fixed top-0 left-0 w-full bg-white z-10 opacity-0",
        "-translate-y-[100%] opacity-0 transition-all duration-300 border-b-[1px]",
        isScrolled &&
          "translate-y-0 opacity-100 shadow-[0_2px_10px_2px_#0000000f] border-[rgba(29, 29, 29, 0.1)]"
      )}
    >
      <Container className="h-full flex items-center w-full">
        <NavbarMenu data={categories} />
      </Container>
    </div>
  );
};

export default Nav;
