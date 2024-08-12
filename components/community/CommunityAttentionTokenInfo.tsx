import { View, Image, Animated } from "react-native";
import { Text } from "../ui/text";
import { shortAddress } from "~/utils/shortAddress";
// import useLoadAttentionTokenInfo from "~/hooks/community/useLoadAttentionTokenInfo";
import { useEffect, useRef, useState } from "react";
// import { Loading } from "../common/Loading";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
// import { cn } from "~/lib/utils";
// import { TrendingDown, TrendingUp } from "../common/Icons";
// import { useATTFactoryContractInfo } from "~/hooks/trade/useATTFactoryContract";
// import { TokenWithTradeInfo } from "~/services/trade/types";
// import { useAccount } from "wagmi";
// import { getTokenInfo } from "~/hooks/trade/useERC20Contract";
// import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { formatUnits } from "viem";
import useATTNftPrice from "~/hooks/trade/useATTNftPrice";
import { CopyTextContainer } from "../common/CopyText";
import { getChain } from "~/utils/chain/getChain";
import { ATT_CONTRACT_CHAIN } from "~/constants";

export default function CommunityAttentionTokenInfo({
  channelId,
  attentionTokenInfo,
}: {
  channelId: string;
  attentionTokenInfo: AttentionTokenEntity;
}) {
  // const { tokenInfo, loading, rejected, loadTokenInfo } =
  //   useLoadAttentionTokenInfo({ channelId });
  // useEffect(() => {
  //   if (rejected || loading || tokenInfo) return;
  //   loadTokenInfo();
  // }, [tokenInfo, loading, rejected, loadTokenInfo]);
  // if (loading) {
  //   return (
  //     <View className="h-80 flex-col items-center justify-center">
  //       <Loading />
  //     </View>
  //   );
  // }
  // if (rejected || !tokenInfo) return null;
  return (
    <View className="w-full flex-col gap-4">
      {/* <View className="flex-row items-center gap-1">
        <Avatar
          alt={attentionTokenInfo.name || ""}
          className="size-[36px] border border-secondary"
        >
          <AvatarImage source={{ uri: attentionTokenInfo.logo || "" }} />
          <AvatarFallback className="border-primary bg-secondary">
            <Text className="text-sm font-bold">{attentionTokenInfo.name}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className=" text-base font-medium">
          {attentionTokenInfo.name}
        </Text>
      </View> */}
      <TokenLaunchProgress tokenInfo={attentionTokenInfo} />
      <TokenPrice tokenInfo={attentionTokenInfo} />
      <TokenInfo tokenInfo={attentionTokenInfo} />
    </View>
  );
}

function TokenLaunchProgress({
  tokenInfo,
}: {
  tokenInfo: AttentionTokenEntity;
}) {
  const progressNumber = Number(tokenInfo.progress.replace("%", ""));
  const progressNumberAnimatedValue = useRef(new Animated.Value(0)).current;
  const rocketLeftInterpolate = progressNumberAnimatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  useEffect(() => {
    if (!progressNumber) return;
    Animated.timing(progressNumberAnimatedValue, {
      toValue: progressNumber,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressNumber]);
  return (
    <View className="h-28 flex-col justify-center gap-4">
      <View className="w-full flex-row items-center justify-between">
        <Text className="font-bold">Token Launch Progress</Text>
        <Text className="text-secondary">{progressNumber}%</Text>
      </View>
      <View className=" relative">
        <Progress
          value={progressNumber}
          className="h-[30px] border border-secondary bg-transparent"
          indicatorClassName=" rounded-[15px] bg-primary-gradient-to-r"
        />
        {progressNumber !== 100 && (
          <Animated.View
            style={{
              position: "absolute",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              left: rocketLeftInterpolate,
              marginLeft: -40,
            }}
          >
            <Image
              source={require("~/assets/images/token-progress/rocket.png")}
              style={{ width: 62, height: 62 }}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

function TokenPrice({ tokenInfo }: { tokenInfo: AttentionTokenEntity }) {
  // const priceTrend = Number(tokenInfo.priceTrend.replace("%", ""));

  const { fetchedPrice, nftPrice, token } = useATTNftPrice({
    tokenContract: tokenInfo.tokenContract,
    nftAmount: 1,
  });
  return (
    <View className="flex-row items-center justify-between">
      <View className=" flex-1 flex-row items-center justify-between gap-1">
        <Text className=" leading-none text-secondary">Price</Text>
        {fetchedPrice && nftPrice && token ? (
          <Text className=" text-2xl font-bold">
            {formatUnits(nftPrice, token.decimals!)} {token.symbol}
          </Text>
        ) : (
          <Text className=" text-2xl font-bold">-- --</Text>
        )}
      </View>

      {/* <View
        className={cn(
          " flex-row gap-3 rounded px-2 py-1",
          priceTrend > 0 ? "bg-[#00D1A7]" : "bg-[#FF5C5C]",
        )}
      >
        {priceTrend > 0 ? (
          <TrendingUp size="16px" color="white" />
        ) : (
          <TrendingDown size="16px" color="white" />
        )}
        <Text className=" leading-none text-white ">{priceTrend}%</Text>
      </View> */}
    </View>
  );
}

const numberToMillion = (num: number) => {
  const n = num / 1000000;
  return n.toFixed(2);
};
function TokenInfo({ tokenInfo }: { tokenInfo: AttentionTokenEntity }) {
  // const chain = getChain(chainId)
  const exploreBase = ATT_CONTRACT_CHAIN?.blockExplorers?.default;
  const contractExploreUrl = `${exploreBase?.url}/address/${tokenInfo.tokenContract}`;
  const data = [
    // {
    //   label: "Market Cap",
    //   value: `$${numberToMillion(Number(tokenInfo.marketCap) || 0)}M`,
    // },
    // {
    //   label: "Buys (24H)",
    //   value: `${tokenInfo.buy24h || 0}`,
    // },
    // {
    //   label: "Sells (24H)",
    //   value: `${tokenInfo.sell24h || 0}`,
    // },
    // {
    //   label: "Holders",
    //   value: `${tokenInfo.holders || 0}`,
    // },
    {
      label: "Token Standard",
      value: tokenInfo.tokenStandard,
    },
    {
      label: "Token Contract",
      value: shortAddress(tokenInfo.tokenContract),
      copyText: contractExploreUrl,
    },
    {
      label: "Chain",
      value: tokenInfo.chain,
    },
  ];

  return (
    <View className="flex-col">
      {data.map((item, index) => (
        <View
          className="h-[50px] flex-row items-center justify-between"
          key={index}
        >
          <Text className="text-base">{item.label}</Text>
          {!!item?.copyText ? (
            <CopyTextContainer copyText={item?.copyText}>
              <Text className="text-base">{item.value}</Text>
            </CopyTextContainer>
          ) : (
            <Text className="text-base">{item.value}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
