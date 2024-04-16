import { CommunityInfo } from "~/services/community/types/community";
import { Button, ButtonProps } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

export default function CommunityBuyShareButton({
  communityInfo,
  className,
  ...props
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  return (
    <Button
      className={cn(" bg-secondary", className)}
      onPress={() => {
        alert("TODO");
      }}
      {...props}
    >
      <Text>Buy with 9,999 DEGEN</Text>
    </Button>
  );
}
