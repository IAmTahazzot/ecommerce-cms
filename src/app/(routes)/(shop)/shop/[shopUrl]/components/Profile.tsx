"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ProfileForm } from "./ProfileForm";
import { AddressForm } from "./AddressForm";
import { cn } from "@/lib/utils";
import { Address, User } from "@prisma/client";
import { useSearchParams } from "next/navigation";

export const Profile = ({
  user,
  profileImageUrl,
}: {
  user: User & { addresses: Address[] };
  profileImageUrl: string | null;
}) => {
  const [view, setView] = useState<"profile" | "address">("profile");
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("address")?.toLowerCase() === "active") setView("address");
  }, [params]);

  return (
    <div className="grid grid-cols-[200px_1fr] gap-x-24">
      <div className="flex flex-col gap-y-2">
        <Button
          variant={"ghost"}
          className={cn(
            "justify-start",
            view === "profile" && "bg-neutral-100"
          )}
          onClick={() => setView("profile")}
        >
          Profile
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            "justify-start",
            view === "address" && "bg-neutral-100"
          )}
          onClick={() => setView("address")}
        >
          Address
        </Button>
      </div>

      <div>
        {view === "profile" && (
          <ProfileForm user={user} profileImageUrl={profileImageUrl} />
        )}
        {view === "address" && <AddressForm address={user.addresses[0]} />}
      </div>
    </div>
  );
};
