import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyP({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const classes = cn("leading-7 [&:not(:first-child)]:mt-6", className);
  return <p className={classes}>{children}</p>;
}
