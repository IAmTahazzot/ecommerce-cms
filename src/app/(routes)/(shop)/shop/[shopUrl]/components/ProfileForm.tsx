"use client";

import Image from "next/image";
import { Address, User } from "@prisma/client";

export const ProfileForm = ({
  user,
  profileImageUrl,
}: {
  user: User & { addresses: Address[] };
  profileImageUrl: string | null;
}) => {
  return (
    <div>
      {profileImageUrl && (
        <div className="flex items-center">
          <Image
            src={profileImageUrl}
            height={80}
            width={80}
            alt={user.firstName}
          />
        </div>
      )}
      <div className="text-xl font-semibold mt-3">
        {user.firstName} {user.lastName}
      </div>

      <div className="flex items-center text-sm mt-7">
        <div className="basis-32">
          <span className="text-xs font-semibold bg-sky-50 rounded-md text-sky-500 px-3 py-1">
            ID
          </span>
        </div>
        <div className="text-xs font-semibold bg-sky-50 rounded-md text-sky-500 px-3 py-1">
          {user.userId}
        </div>
      </div>
      <div className="flex items-center text-sm mt-4">
        <div className="basis-32">
          <span className="text-xs font-semibold bg-sky-50 rounded-md text-sky-500 px-3 py-1">
            Email
          </span>
        </div>
        <div>{user.email}</div>
      </div>

      <div className='mt-10'>
        <span className='text-xs text-muted-foreground'>(User information update will be added later)</span>
      </div>
    </div>
  );
};
