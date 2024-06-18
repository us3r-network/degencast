import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_TABBAR_HEIGHT } from "~/constants";
import { Dimensions, View, ViewProps } from "react-native";
import { isDesktop } from "react-device-detect";
import { cn } from "~/lib/utils";

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

export function ConnectFarcasterCard() {
  const { authenticated, login, linkFarcaster } = usePrivy();
  const { currFid } = useFarcasterAccount();
  return (
    <Card className="box-border h-full w-full flex-col items-center justify-center gap-4 rounded-[20px] border-none">
      <Button
        className="rounded-lg bg-primary"
        onPress={() => {
          if (!authenticated) {
            login();
            return;
          }
          if (!currFid) {
            linkFarcaster();
            return;
          }
        }}
      >
        <Text className="text-primary-foreground">
          {(() => {
            if (!authenticated) {
              return "Log in";
            }
            if (!currFid) {
              return "Link Farcaster";
            }
          })()}
        </Text>
      </Button>
    </Card>
  );
}
