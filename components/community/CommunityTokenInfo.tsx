import { useEffect, useState } from "react";
import { View } from "react-native";
import TradingViewChart from "./TradingViewChart";
import axios from "axios";
import { Text } from "../ui/text";
import TradingViewNotice from "./TradingViewNotice";
import { TradeInfo } from "~/services/community/types/trade";

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
  const [prices, setPrices] = useState([]);
  const { chain, poolAddress } = tradeInfo;
  const ohlcvApiBaseUrl = `https://api.geckoterminal.com/api/v2/networks/${chain}/pools/${poolAddress}`;

  useEffect(() => {
    setPrices([]);
    axios
      .get(`${ohlcvApiBaseUrl}/ohlcv/day?aggregate=1&limit=7`)
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
        price={Number(tradeInfo?.stats.token_price_usd)}
        priceChange={Number(tradeInfo?.stats.price_change_percentage.h24)}
      />
      <TokenInfo tokenInfo={tokenInfo} tradeInfo={tradeInfo} />
      <TradingViewNotice />
    </View>
  );
}

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
      value: `$${tradeInfo.stats.market_cap_usd || 0}`,
    },
    {
      label: "Volume (24H)",
      value: `$${tradeInfo.stats.volume_usd.h24 || 0}`,
    },
    {
      label: "Buys (24H)",
      value: `$${tradeInfo.stats.transactions.h24.buys || 0}`,
    },
    {
      label: "Sells (24H)",
      value: `$${tradeInfo.stats.transactions.h24.sells || 0}`,
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
      value: tokenInfo.contract,
    },
    {
      label: "Chain",
      value: tokenInfo.chain,
    },
  ];
  return (
    <View className=" mt-5 flex-col gap-5">
      {data.map((item, index) => (
        <View className=" flex-row items-center justify-between" key={index}>
          <Text className=" text-base">{item.label}</Text>
          <Text className=" text-base">{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
