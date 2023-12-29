"use client";

import React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const variants = cva("button", {
  variants: {
    intent: {
      primary: [
        "bg-blue-500",
        "text-white",
        "border-transparent",
        "hover:bg-blue-600",
      ],
      secondary: [
        "bg-white",
        "text-purple-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
  },
  compoundVariants: [{ intent: "primary", size: "medium", class: "uppercase" }],
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export const Button = ({ className,children, intent, size, ...props }: ButtonProps) => {
  return (
    <button
      className={variants({ intent, size, className })}
      onClick={(): void => alert("booped")}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
