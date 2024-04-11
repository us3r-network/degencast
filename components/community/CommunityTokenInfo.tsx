import { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import WebView, { WebViewProps } from "react-native-webview";
import TradingViewChart from "./TradingViewChart";
import axios from "axios";
import { Text } from "../ui/text";

type GeckoterminalTokenPoolInfo = {
  name: string;
  address: string;
  base_token_price_usd: string;
  quote_token_price_usd: string;
  base_token_price_native_currency: string;
  quote_token_price_native_currency: string;
  base_token_price_quote_token: string;
  quote_token_price_base_token: string;
  pool_created_at: string;
  reserve_in_usd: string;
  fdv_usd: string;
  market_cap_usd: string;
  price_change_percentage: {
    h1: string;
    h6: string;
    h24: string;
    m5: string;
  };
  transactions: any;
  volume_usd: {
    h1: string;
    h6: string;
    h24: string;
    m5: string;
  };
};
export default function CommunityTokenInfo({
  chain,
  poolAddress,
}: {
  chain: string;
  poolAddress: string;
}) {
  const [poolInfo, setPoolInfo] = useState<GeckoterminalTokenPoolInfo | null>(
    null,
  );
  const [prices, setPrices] = useState([]);
  const apiBaseUrl = `https://api.geckoterminal.com/api/v2/networks/${chain}/pools/${poolAddress}`;

  useEffect(() => {
    setPoolInfo(null);
    setPrices([]);
    axios
      .get(`${apiBaseUrl}`)
      .then((res) => {
        const { data } = res.data;
        const info = data?.attributes;

        setPoolInfo(info);
      })
      .catch((err) => {
        console.log("err", err);
      });
    axios
      .get(`${apiBaseUrl}/ohlcv/day?aggregate=1&limit=7`)
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
  }, [apiBaseUrl]);
  return (
    <View className="w-full">
      <TradingViewChart prices={prices} price={9999} priceChange={9999} />
      <TokenInfo poolInfo={poolInfo} />
    </View>
  );
}

function TokenInfo({
  poolInfo,
}: {
  poolInfo: GeckoterminalTokenPoolInfo | null;
}) {
  const {
    name,
    address,
    base_token_price_usd,
    quote_token_price_usd,
    base_token_price_native_currency,
    quote_token_price_native_currency,
    base_token_price_quote_token,
    quote_token_price_base_token,
    pool_created_at,
    reserve_in_usd,
    fdv_usd,
    market_cap_usd,
    price_change_percentage,
    transactions,
    volume_usd,
  } = poolInfo || {};
  const data = [
    {
      label: "Market Cap",
      value: `$${market_cap_usd || 0}`,
    },
    {
      label: "Volume (24H)",
      value: `$${volume_usd?.h24 || 0}`,
    },
    {
      label: "All Time High",
      value: `$9999`,
    },
    {
      label: "All Time Low",
      value: `$9999`,
    },
    {
      label: "Total Supply",
      value: `9999999`,
    },
    {
      label: "Token Standard",
      value: `36,965,935,954`,
    },
    {
      label: "Token Contract",
      value: "0x4ed4...efed",
    },
    {
      label: "Chain",
      value: "Base",
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
