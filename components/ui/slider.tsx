import * as React from "react";
import * as SliderPrimitive from "~/components/primitives/slider";
import { cn } from "~/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative h-5", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative w-full h-full rounded-full bg-white/20">
      <SliderPrimitive.Range className="h-full absolute rounded-l-full bg-secondary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="size-5 rounded-full bg-white"
      aria-label="Volume"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
