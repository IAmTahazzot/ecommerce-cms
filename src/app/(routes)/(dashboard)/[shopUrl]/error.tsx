'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error ({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
      <div className="h-screen flex justify-center bg-neutral-50">
        <div className="max-w-[500px] self-start  p-4 my-4 text-neutral-800 border bg-white">
          <h3 className="mb-3 font-bold">{error.message}</h3>
          <p className="text-xs">
            Please refresh the page or try another time. Signing up again may
            resolve the issue.
          </p>
          <Link href="/">
            <Button variant={"default"} size={"sm"} className="mt-4">
              Back to homepage
            </Button>
          </Link>
        </div>
      </div>
  );
}