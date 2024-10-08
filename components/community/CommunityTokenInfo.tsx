import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import TradingViewChart from "./TradingViewChart";
import axios from "axios";
import { Text } from "../ui/text";
import TradingViewNotice from "./TradingViewNotice";
import { TradeInfo } from "~/services/community/types/trade";
import { shortAddress } from "~/utils/shortAddress";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { TradeButton, TradeChannelTokenButton } from "../onchain-actions/swap/TradeButton";

export default function CommunityTokenInfo({
  tokenInfo,
  tradeInfo,
}: {
  tokenInfo: {
    standard: string;
    contract: string;
    chain: string;
  };
  tradeInfo: TradeInfo;
}) {
  const { loading: communityTokensLoading, items: communityTokens } =
    useCommunityTokens();
  const tokenAddress = tradeInfo.tokenAddress;
  const communityToken = useMemo(
    () =>
      communityTokens.find(
        (item) => tokenAddress && item.tradeInfo?.tokenAddress === tokenAddress,
      ),
    [communityTokens, tokenAddress],
  );

  const [prices, setPrices] = useState([]);
  const { chain, poolAddress } = tradeInfo;
  const ohlcvApiBaseUrl = `https://api.geckoterminal.com/api/v2/networks/${chain}/pools/${poolAddress}`;

  useEffect(() => {
    setPrices([]);
    axios
      .get(`${ohlcvApiBaseUrl}/ohlcv/hour?aggregate=1&limit=168`)
      .then((res) => {
        const { data, meta } = res.data;
        const ohlcvList = data?.attributes?.ohlcv_list || [];
        const closePrices = ohlcvList
          .map((ohlcv: Array<number>) => ({
            time: ohlcv[0],
            value: ohlcv[4],
          }))
          .reverse();
        setPrices(closePrices);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [ohlcvApiBaseUrl]);
  return (
    <View className="w-full">
      <TradingViewChart
        name={tradeInfo.name}
        img={tradeInfo.imageURL}
        prices={prices}
        price={Number(tradeInfo?.stats?.token_price_usd)}
        priceChange={Number(tradeInfo?.stats.price_change_percentage.h24)}
      />
      <TokenInfo tokenInfo={tokenInfo} tradeInfo={tradeInfo} />

      {communityToken && (
        <TradeChannelTokenButton
          token2={communityToken}
          className="mt-4 rounded-[10px] bg-primary"
        />
      )}

      <TradingViewNotice />
    </View>
  );
}

const numberToMillion = (num: number) => {
  const n = num / 1000000;
  return n.toFixed(2);
};
function TokenInfo({
  tokenInfo,
  tradeInfo,
}: {
  tokenInfo: {
    standard: string;
    contract: string;
    chain: string;
  };
  tradeInfo: TradeInfo;
}) {
  const data = [
    {
      label: "Market Cap",
      value: `$${numberToMillion(Number(tradeInfo.stats.market_cap_usd) || 0)}M`,
    },
    {
      label: "Volume (24H)",
      value: `$${numberToMillion(Number(tradeInfo.stats.volume_usd.h24) || 0)}M`,
    },
    {
      label: "Buys (24H)",
      value: `${tradeInfo.stats.transactions.h24.buys || 0}`,
    },
    {
      label: "Sells (24H)",
      value: `${tradeInfo.stats.transactions.h24.sells || 0}`,
    },
    {
      label: "Holders",
      value: `${tradeInfo.holdersStats[0]?.count || 0}`,
    },
    {
      label: "Token Standard",
      value: tokenInfo.standard,
    },
    {
      label: "Token Contract",
      value: shortAddress(tokenInfo.contract),
    },
    {
      label: "Chain",
      value: tokenInfo.chain,
    },
  ];
  return (
    <View className="mt-5 flex-col gap-5">
      {data.map((item, index) => (
        <View className="flex-row items-center justify-between" key={index}>
          <Text className="text-base">{item.label}</Text>
          <Text className="text-base">{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
