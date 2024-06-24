import { Text } from "~/components/ui/text";
import { Button, ButtonProps } from "../ui/button";
import useJoinCommunityAction from "~/hooks/community/useJoinCommunityAction";
import { cn } from "~/lib/utils";
import { TextProps, View } from "react-native";
import { CircleCheck, CirclePlus, MinusCircle, Plus } from "../common/Icons";

export default function CommunityJoinButton({
  channelId,
  className,
  textProps,
  ...props
}: ButtonProps & {
  channelId: string;
  textProps?: TextProps;
}) {
  const { joined, isPending, joinChangeAction } =
    useJoinCommunityAction(channelId);
  return (
    <Button
      variant={joined ? "outline" : "secondary"}
      className={cn(
        "min-w-14 rounded-[0.625rem] px-0 text-xs font-medium",
        className,
      )}
      size="sm"
      disabled={isPending}
      onPress={(e) => {
        e.stopPropagation();
        e.preventDefault();
        joinChangeAction();
      }}
      {...props}
    >
      <Text {...(textProps || {})}>
        {(() => {
          if (joined) {
            if (isPending) {
              return "Unjoining ...";
            }
            return "Joined";
          }
          if (isPending) {
            return "Joining ...";
          }
          return "Join";
        })()}
      </Text>
    </Button>
  );
}

export function CommunityJoinIconButton({
  channelId,
  className,
  textProps,
  ...props
}: ButtonProps & {
  channelId: string;
  textProps?: TextProps;
}) {
  const { joined, isPending, joinChangeAction } = useJoinCommunityAction(
    channelId,
    {
      showToast: true,
    },
  );
  return (
    <Button
      className={cn("bg-transparent p-0", className)}
      disabled={isPending}
      onPress={(e) => {
        e.stopPropagation();
        joinChangeAction();
      }}
      {...props}
    >
      {joined ? (
        <MinusCircle strokeWidth={1} className="size-10 stroke-secondary" />
      ) : (
        <View className="flex size-10 items-center justify-center rounded-full bg-secondary">
          <Plus className=" size-6 stroke-primary" />
        </View>
      )}
    </Button>
  );
}
