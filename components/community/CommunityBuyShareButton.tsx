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
import { TextProps } from "react-native";
import { ActionButton } from "../post/PostActions";

export default function CommunityBuyShareButton({
  communityInfo,
  className,
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  const attentionTokenAddress = communityInfo?.attentionTokenAddress;
  if (!attentionTokenAddress) {
    return null;
  }
  return (
    <BuyChannelBadgeButton
      tokenAddress={attentionTokenAddress}
      logo={communityInfo.logo}
      name={communityInfo.name}
    />
  );
}

export function ExploreBuyShareIconButton({
  communityInfo,
  className,
}: ButtonProps & {
  communityInfo: CommunityInfo;
}) {
  const attentionTokenAddress = communityInfo?.attentionTokenAddress;
  if (!attentionTokenAddress) {
    return null;
  }
  return (
    <BuyChannelBadgeButton
      tokenAddress={attentionTokenAddress}
      logo={communityInfo.logo}
      name={communityInfo.name}
    />
  );
}

export function BuyChannelBadgeWithUpvoteButton({
  communityInfo,
  className,
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
      renderButton={(props) => (
        <BuyChannelBadgeButtonStyled {...props}>
          <BuyChannelBadgeTextStyled>
            Upvote Channel 👍
          </BuyChannelBadgeTextStyled>
        </BuyChannelBadgeButtonStyled>
      )}
    />
  );
}

export function BuyChannelBadgeWithIconButton({
  communityInfo,
  className,
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
      renderButton={(props) => (
        <ActionButton
          className={cn(
            "z-10 h-[50px] w-[50px] shadow-md shadow-primary",
            className,
          )}
          {...props}
        >
          <Text className=" text-xl font-bold">👍</Text>
        </ActionButton>
      )}
    />
  );
}

function BuyChannelBadgeButton({
  tokenAddress,
  logo,
  name,
}: {
  tokenAddress: `0x${string}`;
  logo?: string;
  name?: string;
}) {
  const account = useAccount();
  const amount = 1;
  const { getMintNFTPriceAfterFee, getPaymentToken } =
    useATTFactoryContractInfo(tokenAddress);

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
    <BuyButton
      logo={logo}
      name={name}
      tokenAddress={tokenAddress}
      renderButton={(props) => (
        <BuyChannelBadgeButtonStyled {...props}>
          <BuyChannelBadgeTextStyled>
            {!account.address
              ? "Buy Channel Badge"
              : fetchedPrice
                ? `Buy Channel Badge with ${perSharePrice} ${symbol}`
                : `Fetching Price...`}
          </BuyChannelBadgeTextStyled>
        </BuyChannelBadgeButtonStyled>
      )}
    />
  );
}

function BuyChannelBadgeButtonStyled({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant={"secondary"}
      className={cn(
        " h-[60px] flex-row items-center gap-1 rounded-[20px] bg-secondary px-[12px] py-[6px] ",
        className,
      )}
      {...props}
    />
  );
}

function BuyChannelBadgeTextStyled({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(" line-clamp-1 text-base font-bold", className)}
      {...props}
    />
  );
}
