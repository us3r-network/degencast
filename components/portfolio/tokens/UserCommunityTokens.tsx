import { OwnedToken } from "alchemy-sdk";
import { round } from "lodash";
import React from "react";
import { Text, View } from "react-native";
import { base } from "viem/chains";
import { ChevronDown, ChevronUp } from "~/components/Icons";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { TokenInfo } from "./TokenInfo";
import TradeButton, { NATIVE_TOKEN } from "../TradeButton";

const DEFAULT_ITEMS_NUM = 3;
export default function CommunityTokens() {
  const { tokens } = useUserCommunityTokens();
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">
            Community Token ({tokens.length})
          </Text>
        </View>
        {tokens?.length > DEFAULT_ITEMS_NUM && open ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </CollapsibleTrigger>
      <View className="flex w-full gap-2">
        {tokens?.length > 0 &&
          tokens
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((token) => (
              <CommunityToken key={token.contractAddress} {...token} />
            ))}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {tokens?.length > DEFAULT_ITEMS_NUM &&
          tokens
            .slice(DEFAULT_ITEMS_NUM)
            .map((token) => (
              <CommunityToken key={token.contractAddress} {...token} />
            ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function CommunityToken(token: OwnedToken) {
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo {...token} />
      <View className="flex-row items-center gap-2">
        <Text>{round(Number(token.balance), 2)}</Text>
        <TradeButton
          fromChain={base.id}
          fromToken={token.contractAddress as `0x${string}`}
          toChain={base.id}
          toToken={NATIVE_TOKEN}
        />
      </View>
    </View>
  );
}
