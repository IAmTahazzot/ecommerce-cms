import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "../ui/button";

interface ErrorTemplateProps {
  type: 'Unauthorized' | 'Something went wrong' | 'Page not found' | 'Network error' | 'No data found' | 'No products found' | 'No orders found' | 'No customers found' | 'No categories found' | 'No store found';
  description?: string;
  action?: ReactNode;
}

export const ErrorTemplate = ({
  type,
  description,
  action,
}: ErrorTemplateProps) => {
  return (
    <div className="h-screen flex justify-center bg-neutral-50">
      <div className="w-[90%] md:w-[500px] self-start  p-4 my-4 text-neutral-800 border bg-white">
        <h3 className="mb-3 font-bold">{type}</h3>
        <p className="text-xs">
          {description ? (
            description
          ) : (
            <span>
              Please refresh the page or try another time. Signing up again may
              resolve the issue.
            </span>
          )}
        </p>
        {action ? (
          <div className="mt-4">{action}</div>
        ) : (
          <Link href="/">
            <Button variant={"default"} size={"sm"} className="mt-4">
              Back to homepage
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
