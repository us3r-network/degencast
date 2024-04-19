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
      className={cn(" flex-col items-center bg-secondary", className)}
      onPress={() => {
        alert("TODO");
      }}
      {...props}
    >
      <Text>Buy with </Text>
      <Text>9,999 DEGEN</Text>
    </Button>
  );
}
