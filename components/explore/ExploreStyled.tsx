import { DEFAULT_HEADER_HEIGHT, DEFAULT_TABBAR_HEIGHT } from "~/constants";
import { Dimensions, View, ViewProps } from "react-native";
import { isDesktop } from "react-device-detect";
import { cn } from "~/lib/utils";
import { Card } from "../ui/card";

export const headerHeight = DEFAULT_HEADER_HEIGHT;
export const footerHeight = DEFAULT_TABBAR_HEIGHT;
export const itemPaddingTop = 15;
export const itemHeight =
  Dimensions.get("window").height -
  headerHeight -
  footerHeight +
  itemPaddingTop;
export function ExploreSwipeItem({ children, className, ...props }: ViewProps) {
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
}

export function ExploreCard({ className, ...props }: ViewProps) {
  return (
    <Card
      className={cn(
        "box-border h-full w-full flex-col gap-4 rounded-[20px] border-none p-3 pt-[30px]",
        className,
      )}
      {...props}
    />
  );
}
