"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider_NoThumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
      <SliderPrimitive.Range className="absolute h-full bg-neutral-900 dark:bg-neutral-50" />
    </SliderPrimitive.Track>
    {children}
  </SliderPrimitive.Root>
));
Slider_NoThumb.displayName = SliderPrimitive.Root.displayName;

export { Slider_NoThumb };
