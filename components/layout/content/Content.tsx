import { View, ViewProps } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
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

export function CardWarper({ className, children, ...props }: ViewProps) {
  return (
    <Card
      className={cn(
        "h-full w-full rounded-2xl rounded-b-none p-4 pb-0",
        className,
      )}
      {...props}
    >
      <CardContent className="h-full w-full p-0">{children}</CardContent>
    </Card>
  );
}
