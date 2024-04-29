import { formatUnits } from "viem";
import { Text } from "~/components/ui/text";
import { NATIVE_TOKEN_METADATA } from "~/constants";
import { SHARE_ACTION, useShareContractInfo } from "~/hooks/trade/useShareContract";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import { BuyButton } from "../trade/ShareButton";
import { Button, ButtonProps } from "../ui/button";

export default function CommunityBuyShareButton({
  communityInfo,
  className,
  ...props
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  if (!communityInfo?.shares?.[0]?.subjectAddress) {
    return null;
  }
  return (
    <BuyButton
      sharesSubject={communityInfo?.shares?.[0]?.subjectAddress}
      logo={communityInfo.logo}
      name={communityInfo.name}
      renderButton={() => {
        const token = NATIVE_TOKEN_METADATA;
        const amount = 1;
        const sharesSubject = communityInfo?.shares?.[0]?.subjectAddress as `0x${string}`;
        const { getPrice } = useShareContractInfo(sharesSubject);
        const { data: price } = getPrice(SHARE_ACTION.BUY, amount, true);
        const fetchedPrice = !!(price && amount && token && token.decimals);
        const perSharePrice = fetchedPrice
          ? formatUnits(price / BigInt(amount), token.decimals!)
          : "";
        const symbol = token?.symbol || "";

        return (
          <Button
            variant={"secondary"}
            className={cn(" flex-col items-center ")}
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
