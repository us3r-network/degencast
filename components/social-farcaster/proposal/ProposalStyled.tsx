import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { LegacyRef } from "react";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { Card } from "~/components/ui/card";

export const CardWrapper = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }: ViewProps, ref: LegacyRef<View>) => {
  return (
    <Card
      className={cn(
        "box-border h-full w-full flex-col gap-4 rounded-[20px] border-none p-4",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
