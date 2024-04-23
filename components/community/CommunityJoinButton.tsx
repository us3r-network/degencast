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
  const { className: textClassName, ...restTextProps } = textProps || {};
  return (
    <Button
      className={cn("w-14 bg-secondary", className)}
      size="sm"
      onPress={(e) => {
        e.stopPropagation();
        joinChangeAction();
      }}
      {...props}
    >
      <Text
        {...(restTextProps || {})}
      >
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
