import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { LegacyRef } from "react";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { AlarmClockIcon, DiamondPlus } from "~/components/common/Icons";
import dayjs from "dayjs";

export const CardWrapper = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }: ViewProps, ref: LegacyRef<View>) => {
  return (
    <Card
      className={cn(
        "box-border w-full flex-col gap-4 rounded-[20px] border-none p-4",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const MintCount = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & {
    count: number;
  }
>(({ className, count, ...props }, ref: LegacyRef<View>) => {
  return (
    <View
      className={cn("flex flex-row items-center gap-1", className)}
      ref={ref}
      {...props}
    >
      <DiamondPlus className="size-4 stroke-[#9BA1AD]" />
      <Text className="text-xs text-[#9BA1AD]">{count}</Text>
    </View>
  );
});

export const Deadline = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & {
    timestamp: number;
  }
>(({ className, timestamp, ...props }, ref: LegacyRef<View>) => {
  const now = dayjs().unix();
  const isLessThanOneDay = Number(timestamp) - now < 24 * 60 * 60;
  const text = isLessThanOneDay
    ? dayjs(timestamp * 1000)
        .date(1)
        .format("HH:mm")
    : dayjs(timestamp * 1000).format("MM/DD");
  return (
    <View
      className={cn("flex flex-row items-center gap-1", className)}
      ref={ref}
      {...props}
    >
      <AlarmClockIcon className="size-4 stroke-[#9BA1AD]" />
      <Text className="text-xs text-[#9BA1AD]">{text}</Text>
    </View>
  );
});
