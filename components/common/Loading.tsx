import { ActivityIndicator, Text, View, Image, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
export function Loading() {
  return (
    <View className="flex h-full w-full items-center justify-center">
      <ActivityIndicator className="text-secondary" />
      {/* <Text className=" text-xl text-secondary">Loading...</Text> */}
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
