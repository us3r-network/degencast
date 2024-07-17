import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";

export function PageContent({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "m-auto w-full flex-1 bg-background max-sm:px-4 sm:w-full sm:max-w-screen-sm",
        className,
      )}
      {...props}
    />
  );
}
