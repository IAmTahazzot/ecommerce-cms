"use client";

import Link from "next/link";

import { VscColorMode } from "react-icons/vsc";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderChunkProps {
  storeUrl: string;
}

export const HeaderChunk = ({ storeUrl }: HeaderChunkProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

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
            <Link href={"/" + storeUrl}>
              <Button variant={"outline"} size={"sm"}>
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/create-store">
              <Button variant={"outline"} size={"sm"}>
                Create Store
              </Button>
            </Link>
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

      <Button variant={"ghost"} size={"icon"}>
        <VscColorMode className="h-[18px] w-[18px] rotate-45" />
      </Button>
    </div>
  );
};
