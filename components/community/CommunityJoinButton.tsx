import { Text } from "~/components/ui/text";
import { Button, ButtonProps } from "../ui/button";
import useJoinCommunityAction from "~/hooks/community/useJoinCommunityAction";
import { CommunityInfo } from "~/services/community/types/community";
import { cn } from "~/lib/utils";
import { TextProps } from "react-native";

export default function CommunityJoinButton({
  communityInfo,
  className,
  textProps,
  ...props
}: ButtonProps & {
  communityInfo: CommunityInfo;
  textProps?: TextProps;
}) {
  const { joined, isPending, joinChangeAction } =
    useJoinCommunityAction(communityInfo);
  return (
    <Button
      variant={joined ? "outline" : "secondary"}
      className={cn(
        "min-w-14 rounded-[0.625rem] px-0 text-xs font-medium",
        className,
      )}
      size="sm"
      onPress={(e) => {
        e.stopPropagation();
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
