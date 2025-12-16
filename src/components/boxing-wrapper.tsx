import { cn } from "@/lib/utils";
import { HTMLAttributes, ElementType } from "react";

interface BoxingWrapperProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function BoxingWrapper({
  children,
  className,
  as: Component = "div",
  ...props
}: BoxingWrapperProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
