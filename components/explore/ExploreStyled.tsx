import { DEFAULT_HEADER_HEIGHT, DEFAULT_TABBAR_HEIGHT } from "~/constants";
import { Dimensions, View, ViewProps } from "react-native";
import { isDesktop } from "react-device-detect";
import { cn } from "~/lib/utils";
import { Card } from "../ui/card";
import { forwardRef, LegacyRef } from "react";
import React from "react";
import { ViewRef } from "../primitives/types";

export const headerHeight = DEFAULT_HEADER_HEIGHT;
export const footerHeight = DEFAULT_TABBAR_HEIGHT;
export const itemPaddingTop = 15;
export const itemHeight =
  Dimensions.get("window").height -
  headerHeight -
  footerHeight -
  itemPaddingTop;
export const ExploreSwipeItem = forwardRef(function (
  { children, className, ...props }: ViewProps,
  ref: LegacyRef<View>,
) {
  return (
    <View
      className={cn(
        "flex w-full px-4 sm:max-w-screen-sm sm:px-0",
        isDesktop && " w-screen",
        className,
      )}
      style={{
        ...(!isDesktop ? { width: Dimensions.get("window").width } : {}),
        height: itemHeight,
        paddingTop: itemPaddingTop,
      }}
      ref={ref}
      {...props}
    >
      <View
        style={{
          height: itemHeight - itemPaddingTop,
        }}
      >
        {children}
      </View>
    </View>
  );
});

export const ExploreCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }: ViewProps, ref: LegacyRef<View>) => {
  return (
    <Card
      className={cn(
        "box-border h-full w-full flex-col gap-4 rounded-[20px] border-none p-3",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
