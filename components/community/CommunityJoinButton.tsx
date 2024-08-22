import { Text } from "~/components/ui/text";
import { Button, ButtonProps } from "../ui/button";
import useJoinCommunityAction from "~/hooks/community/useJoinCommunityAction";
import { cn } from "~/lib/utils";
import { ActivityIndicator, TextProps, View } from "react-native";
import { MinusCircle, Plus, PlusCircle } from "../common/Icons";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "~/constants";

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
      {isPending ? (
        <ActivityIndicator size={40} color={SECONDARY_COLOR} />
      ) : joined ? (
        <MinusCircle strokeWidth={1} className="size-10 stroke-secondary" />
      ) : (
        <View className="flex size-10 items-center justify-center rounded-full bg-secondary">
          <Plus className=" size-6 stroke-primary" />
        </View>
      )}
    </Button>
  );
}

export function CommunityAvatarJoinIconButton({
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
      className={cn(
        "m-0 h-fit w-fit rounded-full bg-transparent p-0",
        className,
      )}
      disabled={isPending}
      onPress={(e) => {
        e.preventDefault();
        e.stopPropagation();
        joinChangeAction();
      }}
      {...props}
    >
      {isPending ? (
        <ActivityIndicator size={25} color={PRIMARY_COLOR} />
      ) : joined ? (
        <MinusCircle
          strokeWidth={1}
          size={25}
          className="fill-secondary stroke-secondary-foreground"
        />
      ) : (
        <PlusCircle
          strokeWidth={1}
          size={25}
          className="fill-secondary stroke-secondary-foreground"
        />
      )}
    </Button>
  );
}
