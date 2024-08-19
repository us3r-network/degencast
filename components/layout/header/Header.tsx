import { View, ViewProps, Image } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";

export function Header({ className, ...props }: ViewProps) {
  return (
    <View
      style={{
        height: DEFAULT_HEADER_HEIGHT,
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

export function HeaderLogo({ className, ...props }: ViewProps) {
  return (
    <Image
      source={require("~/assets/images/degencast-logo.png")}
      style={{
        width: 24,
        height: 24,
        resizeMode: "contain",
      }}
    />
  );
}

export function HeaderLeft({
  className,
  ...props
}: ViewProps & { title?: string }) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-start gap-4 sm:min-w-52",
        className,
      )}
      {...props}
    />
  );
}

export function HeaderLeftDefault({
  title,
  ...props
}: ViewProps & { title?: string }) {
  return (
    <HeaderLeft {...props}>
      <View>
        <HeaderLogo />
      </View>
      {title && <Text className=" text-xl text-white">{title}</Text>}
    </HeaderLeft>
  );
}

export function HeaderRight({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-end gap-[10px] sm:min-w-52",
        className,
      )}
      {...props}
    />
  );
}

export function HeaderCenter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "m-auto w-full flex-1 max-sm:px-4 sm:w-full sm:max-w-screen-sm",
        className,
      )}
      {...props}
    />
  );
}
