import { View, ViewProps, Image } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";

export function Header({ className, ...props }: ViewProps) {
  return (
    <View
      style={{
        height: 54,
        paddingLeft: 15,
        paddingRight: 15,
      }}
      className={cn(
        "flex-row items-center justify-between bg-primary",
        className,
      )}
      {...props}
    />
  );
}

export function HeaderLeft({
  title,
  className,
  ...props
}: ViewProps & { title: string }) {
  return (
    <View className={cn("flex-row items-center gap-5", className)} {...props}>
      <View className="hidden sm:block">
        <Image
          source={require("~/assets/images/favicon.png")}
          style={{
            width: 40,
            height: 40,
            resizeMode: "contain",
          }}
        />
      </View>
      <Text className=" text-xl text-white">{title}</Text>
    </View>
  );
}

export function HeaderRight({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex-row items-center gap-[10px]", className)}
      {...props}
    />
  );
}
