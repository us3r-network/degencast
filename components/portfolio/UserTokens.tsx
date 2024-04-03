import { OwnedToken } from "alchemy-sdk";
import { round } from "lodash";
import React from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useAccount } from "wagmi";
import { ChevronDown, ChevronUp } from "~/components/Icons";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import useUserTokens from "~/hooks/user/useUserTokens";
import { Info } from "../Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import TradeButton, { NATIVE_TOKEN } from "./TradeButton";
import { base } from "viem/chains";

export default function UserTokens() {
  return (
    <ScrollView
      className="flex h-full w-full gap-6"
      showsVerticalScrollIndicator={false}
    >
      <Balance />
      <CommunityTokens />
    </ScrollView>
  );
}

export function TokenInfo(token: OwnedToken) {
  return (
    <View className="flex-row items-center gap-2">
      <Avatar alt={token.name || token.symbol || ""} className="size-8">
        <AvatarImage source={{ uri: token.logo || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="text-sm font-bold">
            {token.name?.slice(0, 2).toUpperCase()}
          </Text>
        </AvatarFallback>
      </Avatar>
      <Text className="text-lg font-bold text-primary">{token.name}</Text>
    </View>
  );
}

const tokenAddress: string[] = [
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // Degen
];

function Balance() {
  const { address } = useAccount();
  const { nativeTokens, tokens } = useUserTokens(address || "0x", tokenAddress);
  return (
    <View className="flex w-full gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">Balance</Text>
          <Info size={16} />
        </View>
        <Pressable>
          <Text className="font-bold text-secondary">Send</Text>
        </Pressable>
      </View>
      {[...nativeTokens, ...tokens].map((token) => (
        <MyToken key={token.contractAddress} {...token} />
      ))}
    </View>
  );
}

function MyToken(token: OwnedToken) {
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo {...token} />
      <View className="flex-row items-center gap-2">
        <Text>
          {round(Number(token.balance), 2)} {token.symbol}
        </Text>
        <Button
          className="bg-secondary font-bold"
          onPress={() => {
            Linking.openURL("https://buy-sandbox.moonpay.com/");
          }}
        >
          <Text className="font-bold text-secondary-foreground">Buy</Text>
        </Button>
      </View>
    </View>
  );
}

const DEFAULT_ITEMS_NUM = 3;
function CommunityTokens() {
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
