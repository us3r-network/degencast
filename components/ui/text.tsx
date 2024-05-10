import * as Slot from "~/components/primitives/slot";
import { SlottableTextProps, TextRef } from "~/components/primitives/types";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "~/lib/utils";

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    const fontMap: { [key: string]: string } = {
      "font-normal": "font-interRegularFamily font-normal",
      "font-medium": "font-interMediumFamily font-medium",
      "font-semibold": "font-interSemiboldFamily font-semibold",
      "font-bold": "font-interBoldFamily font-bold",
    };
    const newClassName = className
      ?.split(" ")
      .map((c) => fontMap[c] || c)
      .join(" ");
    return (
      <Component
        className={cn(
          "font-interMedium  text-base text-foreground web:select-text",
          textClass,
          newClassName,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, TextClassContext };
