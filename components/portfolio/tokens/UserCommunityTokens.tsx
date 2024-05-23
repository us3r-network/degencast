import { Link } from "expo-router";
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
import { TradeButton } from "../../trade/TradeButton";
import { DEGEN_ADDRESS } from "~/constants";

const DEFAULT_ITEMS_NUM = 3;
export default function CommunityTokens({
  address,
}: {
  address: `0x${string}`;
}) {
  const { loading, items } = useUserCommunityTokens(address);
  const otherTokens = useMemo(
    () =>
      items?.filter(
        (item) => item.address.toLowerCase() !== DEGEN_ADDRESS.toLowerCase(),
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
            .map((item) => (
              <MyCommunityToken key={item.address} token={item} />
            ))}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {otherTokens?.length > DEFAULT_ITEMS_NUM &&
          otherTokens
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => (
              <MyCommunityToken key={item.address} token={item} />
            ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function MyCommunityToken({
  token,
  withSwapButton,
}: {
  token: TokenWithTradeInfo;
  withSwapButton?: boolean;
}) {
  // console.log("item", item);
  return (
    <View className="flex-row items-center justify-between">
      {token.tradeInfo?.channel ? (
        <Link href={`/communities/${token.tradeInfo?.channel}/tokens`} asChild>
          <Pressable>
            <TokenInfo
              name={token.name}
              logo={token.logoURI}
              // mc={Number(item.tradeInfo?.stats?.fdv_usd)}
            />
          </Pressable>
        </Link>
      ) : (
        <TokenInfo
          name={token.name}
          logo={token.logoURI}
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
