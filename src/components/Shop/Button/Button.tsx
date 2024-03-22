import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = (
  {
    className,
    children,
    disabled,
    type = 'button',
    ...props
  }: ButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  return (
    <button ref={ref} className={
        cn(
            'px-2 py-1 rounded-md transition-colors border-none outline-none hover:bg-black hover:text-white',
            className
        )
    } disabled={disabled} type={type} {...props}>
      {children}
    </button>
  );
}

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
