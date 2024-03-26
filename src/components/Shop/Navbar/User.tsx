"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import { UserResource } from "@clerk/types/dist/user";
import { LogOut, Settings, Store, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type Store as StoreType } from "@prisma/client";
import { toast } from "sonner";

export const User = () => {
  const { user, isLoaded } = useUser();
  const path = usePathname();
  const shopUrl = path.split("/")[2];

  return (
    <>
      {isLoaded ? (
        <>
          <SignedOut>
            <SignInButton
              afterSignInUrl={`/shop/${shopUrl}`}
              afterSignUpUrl={`/shop/${shopUrl}`}
            >
              <span className="text-sm cursor-pointer">Sign In</span>
            </SignInButton>
            <span> | </span>
            <SignUpButton
              afterSignInUrl={`/shop/${shopUrl}`}
              afterSignUpUrl={`/shop/${shopUrl}`}
            >
              <span className="text-sm cursor-pointer">Sign Up</span>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserDropdown user={user} shopUrl={shopUrl} />
          </SignedIn>
        </>
      ) : (
        <div className="text-sm">Loading...</div>
      )}
    </>
  );
};

const UserDropdown = ({
  user,
  shopUrl,
}: {
  user: UserResource | null;
  shopUrl: string;
}) => {
  const [userStoreUrl, setUserStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const userStore = await fetch("/api/store/user-store-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storeUrl: shopUrl }),
        });

        const data: StoreType = await userStore.json();

        setUserStoreUrl(data.storeUrl);
      } catch (error) {
        toast("Please refresh the page", {
          description: "Something went wrong!",
        });
      }
    }

    fetchData();
  }, []);

  if (!user) {
    return <span>Unknown user</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="hover:underline text-sm cursor-pointer">
          {user.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" sideOffset={12} className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Image
              src={user.imageUrl}
              height={16}
              width={16}
              alt={user.fullName + "'s profile"}
              className="rounded-full mr-2"
            />
            <span>Profile</span>
          </DropdownMenuItem>
          {userStoreUrl ? (
            <DropdownMenuItem>
              <Link href={`/${userStoreUrl}`} className="flex items-center">
                <LayoutDashboard className="mr-2 w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href={`/create-store`} className="flex items-center">
                <Store className="mr-2 w-4 h-4" />
                <span> Become a seller </span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Settings className="mr-2 w-4 h-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>
            <div className="flex items-center">
              <LogOut className="mr-2 w-4 h-4" />
              <span>Logout</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
