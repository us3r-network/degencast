import { View, Image, ViewProps } from "react-native";
import { cn } from "~/lib/utils";

export function Loading({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      <Image
        source={require("~/assets/images/degencast-loading.gif")}
        style={{
          width: 60,
          height: 60,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}

export function ScreenLoading({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      <Image
        source={require("~/assets/images/degencast-loading.gif")}
        style={{
          width: 60,
          height: 60,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
