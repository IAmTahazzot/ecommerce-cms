"use client";

import Link from "next/link";

import { VscColorMode } from "react-icons/vsc";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

interface HeaderChunkProps {
  storeUrl: string;
}

export const HeaderChunk = ({ storeUrl }: HeaderChunkProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setTheme, theme} = useTheme()

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-x-2">
        <Skeleton className="w-20 h-8 bg-slate-100" />
        <Skeleton className="w-20 h-8 bg-slate-100" />
        <Skeleton className="w-8 h-8 rounded-full bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-2">
      {isSignedIn ? (
        <div className="flex items-center gap-x-2">
          {storeUrl ? (
            <div className="flex items-center gap-x-3">
              <Link href={"/" + storeUrl}>
                <Button variant={"ghost"} size={"sm"} className="h-8">
                  Open Dashboard
                </Button>
              </Link>
              <Link href={"/stores"}>
                <Button variant={"ghost"} size={"sm"} className="h-8">
                  Visit Stores
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-x-3">
              <Link href="/create-store">
                <Button variant={"outline"} size={"sm"} className="h-8">
                  Create Store
                </Button>
              </Link>
              <Link href={"/stores"}>
                <Button variant={"ghost"} size={"sm"} className="h-8">
                  Visit Stores
                </Button>
              </Link>
            </div>
          )}
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

      <Button variant={"ghost"} size={"icon"} 
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}>
        <VscColorMode className="h-[18px] w-[18px] rotate-45" />
      </Button>
    </div>
  );
};
