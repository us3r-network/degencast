import * as Slot from "~/components/primitives/slot";
import { SlottableTextProps, TextRef } from "~/components/primitives/types";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "~/lib/utils";

const ProposalTextClassContext = React.createContext<string | undefined>(
  undefined,
);

const ProposalText = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(ProposalTextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-base font-medium web:select-text",
          textClass,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
ProposalText.displayName = "Text";

export { ProposalText, ProposalTextClassContext };
