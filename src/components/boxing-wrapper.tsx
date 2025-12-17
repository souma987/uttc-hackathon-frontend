import { cn } from "@/lib/utils";
import { HTMLAttributes, ElementType } from "react";

interface BoxingWrapperProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: "default" | "sm";
}

export function BoxingWrapper({
  children,
  className,
  as: Component = "div",
  size = "default",
  ...props
}: BoxingWrapperProps) {
  const maxWidthClass = size === "sm" ? "max-w-2xl" : "max-w-6xl";
  return (
    <Component
      className={cn("mx-auto w-full", maxWidthClass, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
