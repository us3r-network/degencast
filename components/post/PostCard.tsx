import { View } from "react-native";
import { cn } from "~/lib/utils";

export function PostCardWrapper({
  isDetail,
  className,
  ...props
}: {
  className?: string;
  isDetail?: boolean;
}) {
  return (
    <View
      className={cn(
        "box-border flex cursor-pointer border-b border-[#39424c] bg-[#20262F] px-[20px] hover:bg-[#000000]",
        "max-sm:px-0",
        isDetail && "cursor-default hover:bg-[#20262F]",
        className,
      )}
      {...props}
    />
  );
}
export function PostCardMainWrapper({
  className,
  ...props
}: {
  className?: string;
  isDetail?: boolean;
}) {
  return (
    <View
      className={cn(
        "box-border flex w-full flex-1 flex-col gap-[10px] p-[10px] ",
        className,
      )}
      {...props}
    />
  );
}
export function PostCardFooterWrapper({
  className,
  ...props
}: {
  className?: string;
}) {
  return (
    <View
      className={cn("flex items-center justify-between gap-[10px]", className)}
      {...props}
    />
  );
}

export function PostCardActionsWrapper(props: { className?: string }) {
  return (
    <View
      className={cn("flex items-center gap-[15px]", "max-sm:gap-[10px]")}
      {...props}
    />
  );
}
