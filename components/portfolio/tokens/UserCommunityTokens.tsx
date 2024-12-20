import { Href, Link } from "expo-router";
import { round } from "lodash";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import { TokenInfo } from "~/components/common/TokenInfo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Text } from "~/components/ui/text";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { TradeButton } from "../../onchain-actions/swap/TradeButton";
import { DEGEN_TOKEN_ADDRESS } from "~/constants";
import { Address } from "viem";

const DEFAULT_ITEMS_NUM = 99;
export default function CommunityTokens({ address }: { address: Address }) {
  const { loading, items } = useUserCommunityTokens(address);
  const otherTokens = useMemo(
    () =>
      items?.filter(
        (item) =>
          item.address.toLowerCase() !== DEGEN_TOKEN_ADDRESS.toLowerCase(),
      ),
    [items],
  );
  const [open, setOpen] = React.useState(false);
  // console.log("my-tokens: ", address, items);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-secondary">
            Channel Tokens {loading ? "" : `(${otherTokens.length})`}
          </Text>
        </View>
        {otherTokens?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="flex w-full gap-2">
        {otherTokens?.length > 0 &&
          otherTokens
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => <CommunityToken key={item.address} token={item} />)}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {otherTokens?.length > DEFAULT_ITEMS_NUM &&
          otherTokens
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => <CommunityToken key={item.address} token={item} />)}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function CommunityToken({
  token,
  withSwapButton,
}: {
  token: TokenWithTradeInfo;
  withSwapButton?: boolean;
}) {
  // console.log("item", item);
  const channelID = token.channel?.id || token.tradeInfo?.channel;
  return (
    <View className="flex-row items-center justify-between">
      {channelID ? (
        <Link href={`/communities/${channelID}/attention-token` as Href} asChild>
          <Pressable>
            <TokenInfo
              name={token.name}
              logo={token.logoURI}
              symbol={token.symbol}
              // mc={Number(item.tradeInfo?.stats?.fdv_usd)}
            />
          </Pressable>
        </Link>
      ) : (
        <TokenInfo
          name={token.name}
          logo={token.logoURI}
          symbol={token.symbol}
          // mc={Number(item.tradeInfo?.stats?.fdv_usd)}
        />
      )}
      <View className="flex-row items-center gap-2">
        <Text className="text-lg font-medium">
          {round(Number(token.balance), 2)}
        </Text>
        {withSwapButton && <TradeButton token1={token} />}
      </View>
    </View>
  );
}
