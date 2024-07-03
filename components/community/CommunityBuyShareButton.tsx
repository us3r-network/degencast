import { formatUnits } from "viem";
import { Text } from "~/components/ui/text";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { useATTFactoryContractInfo } from "~/hooks/trade/useATTFactoryContract";
import { cn } from "~/lib/utils";
import { CommunityInfo } from "~/services/community/types/community";
import { BuyButton } from "../trade/BadgeButton";
import { Button, ButtonProps } from "../ui/button";
import { useState, useEffect } from "react";
import { getTokenInfo } from "~/hooks/trade/useERC20Contract";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { useAccount } from "wagmi";

export default function CommunityBuyShareButton({
  communityInfo,
  className,
  ...props
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  const attentionTokenAddress = communityInfo?.attentionTokenAddress;
  if (!attentionTokenAddress) {
    return null;
  }
  return (
    <BuyButton
      tokenAddress={attentionTokenAddress}
      logo={communityInfo.logo}
      name={communityInfo.name}
      renderButton={() => (
        <CommunityBuyShareButtonRender
          attentionTokenAddress={attentionTokenAddress}
        />
      )}
    />
  );
}

function CommunityBuyShareButtonRender({
  attentionTokenAddress,
}: {
  attentionTokenAddress: `0x${string}`;
}) {
  const account = useAccount();
  const amount = 1;
  const { getMintNFTPriceAfterFee, getPaymentToken } =
    useATTFactoryContractInfo(attentionTokenAddress);

  const { paymentToken } = getPaymentToken();
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>(undefined);
  useEffect(() => {
    if (paymentToken && account?.address)
      getTokenInfo({
        address: paymentToken,
        chainId: ATT_CONTRACT_CHAIN.id,
        account: account?.address,
      }).then((tokenInfo) => {
        setToken(tokenInfo);
      });
  }, [paymentToken, account?.address]);

  const { nftPrice } = getMintNFTPriceAfterFee(amount);
  const fetchedPrice = !!(nftPrice && amount && token && token.decimals);
  const perSharePrice = fetchedPrice
    ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
    : "";
  const symbol = token?.symbol || "";

  return (
    <Button
      variant={"secondary"}
      className={cn(
        " h-[60px] flex-row items-center gap-1 rounded-[20px] bg-secondary px-[12px] py-[6px] ",
      )}
    >
      {fetchedPrice ? (
        <Text className="line-clamp-1 text-base font-bold">
          Buy Channel Badge with {perSharePrice} {symbol}
        </Text>
      ) : (
        <Text className="line-clamp-1 text-base font-bold">
          {" "}
          Fetching Price...{" "}
        </Text>
      )}
    </Button>
  );
}
