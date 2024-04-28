import { CommunityInfo } from "~/services/community/types/community";
import { Button, ButtonProps } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { BuyButton } from "../trade/ShareButton";

export default function CommunityBuyShareButton({
  communityInfo,
  className,
  ...props
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  return (
    <BuyButton
      sharesSubject={communityInfo?.shares?.[0]?.subjectAddress || ("" as any)}
      logo={communityInfo.logo}
      name={communityInfo.name}
      renderButton={({ fetchedPrice, perSharePrice, symbol }) => {
        return (
          <Button
            variant={"secondary"}
            className={cn(" flex-col items-center ", className)}
            {...props}
          >
            {fetchedPrice ? (
              <>
                <Text>Buy with </Text>
                <Text>
                  {perSharePrice} {symbol}
                </Text>
              </>
            ) : (
              <Text> Fetching Price... </Text>
            )}
          </Button>
        );
      }}
    />
  );
}
