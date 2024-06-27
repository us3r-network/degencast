import { formatUnits } from "viem";
import { Text } from "~/components/ui/text";
import { BADGE_PAYMENT_TOKEN } from "~/constants/att";
import { useATTFactoryContractInfo } from "~/hooks/trade/useATTFactoryContract";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import { BuyButton } from "../trade/BadgeButton";
import { Button, ButtonProps } from "../ui/button";

export default function CommunityBuyShareButton({
  communityInfo,
  className,
  ...props
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  const badgeTokenAddress = communityInfo?.badgeTokenAddress;
  if (!badgeTokenAddress) {
    return null;
  }
  return (
    <BuyButton
      tokenAddress={badgeTokenAddress}
      logo={communityInfo.logo}
      name={communityInfo.name}
      renderButton={() => {
        const token = BADGE_PAYMENT_TOKEN;
        const amount = 1;
        const { getMintNFTPriceAfterFee } = useATTFactoryContractInfo(badgeTokenAddress);
        const { nftPrice } = getMintNFTPriceAfterFee(amount);
        const fetchedPrice = !!(nftPrice && amount && token && token.decimals);
        const perSharePrice = fetchedPrice
          ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
          : "";
        const symbol = token?.symbol || "";

        return (
          <Button
            variant={"secondary"}
            className={cn(" flex-col items-center ")}
          >
            {fetchedPrice ? (
              <Text>
                Buy with {perSharePrice} {symbol}
              </Text>
            ) : (
              <Text> Fetching Price... </Text>
            )}
          </Button>
        );
      }}
    />
  );
}
