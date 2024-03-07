'use client'

import Link from "next/link";

import { VscColorMode } from 'react-icons/vsc';

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { CoverImage } from "./components/CoverImage";
import { useUser, SignOutButton } from '@clerk/nextjs'
import { SiteSkeleton } from "./components/SiteSkeleton";

const UnityShopMainPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <SiteSkeleton />;
  }

  return (
    <div>
      <Container className="max-w-[1200px]">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-normal font-bold select-none cursor-pointer group/logo space-x-1">
              <span>Unity</span>
              <span className="px-2 py-1 bg-blue-500 text-white rounded-md group-hover/logo:bg-black group-hover/logo:text-blue-100 transition-colors">
                Shop
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-x-2">
            {isSignedIn ? (
              <div className="flex items-center gap-x-2">
                <Button variant={"outline"} size={"sm"}>
                  Open Dashboard
                </Button>
                <SignOutButton>
                  <Button variant={"default"} size={"sm"}>
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <Link href="/sign-in">
                  <Button variant={"default"} size={"sm"}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant={"outline"} size={"sm"}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Button variant={"ghost"} size={"icon"}>
              <VscColorMode className="h-[18px] w-[18px] rotate-45" />
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-y-4 mt-32 text-center">
          <div className="flex items-center justify-center w-fit mx-auto py-1 px-3 gap-2 rounded-full bg-slate-100 border border-slate-200 text-sm">
            <span>🎉</span>
            <span>Explore more by signing up</span>
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter leading-[1.12] text-neutral-900">
            Power Your Vision: <span className="rounded">UnityShop </span>CMS,
            Your Digital Shop Management
          </h1>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button variant={"default"} size={"lg"} className="h-12">
              Get Started
            </Button>
            <Button variant={"outline"} size={"lg"} className="h-12">
              Learn More
            </Button>
          </div>
        </section>

        <section className="mt-32">
          <CoverImage />
        </section>
      </Container>
    </div>
  );
};

export default UnityShopMainPage;
