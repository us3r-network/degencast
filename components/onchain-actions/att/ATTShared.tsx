import * as Clipboard from "expo-clipboard";
import React, { createContext, useContext } from "react";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { Address } from "viem";
// import About from "~/components/common/About";
import { TokenActivitieList } from "~/components/activity/Activities";
import { Copy } from "~/components/common/Icons";
import NeynarCastUserInfo from "~/components/social-farcaster/proposal/NeynarCastUserInfo";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useCurationTokenInfo from "~/hooks/user/useCurationTokenInfo";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CurationTokenInfo, ERC42069Token } from "~/services/trade/types";
import { shortPubKey } from "~/utils/shortPubKey";
import ATTExternalLink from "./ATTExternalLink";

export type NFTProps = {
  cast?: NeynarCast;
  token: ERC42069Token;
};

export const NftCtx = createContext<NFTProps | undefined>(undefined);

export const useNftCtx = () => {
  const ctx = useContext(NftCtx);
  if (!ctx) {
    throw new Error("useCreateProposalCtx must be used within a provider");
  }
  return ctx;
};

export const DetailsScene = () => {
  const { token } = useNftCtx();
  const { tokenInfo } = useCurationTokenInfo(
    token.contractAddress,
    token.tokenId,
  );
  // console.log("DetailsScene", token, cast);
  return <NftDetails token={token} tokenInfo={tokenInfo} />;
};

export const NftDetails = ({
  token,
  tokenInfo,
}: {
  token: ERC42069Token;
  tokenInfo: CurationTokenInfo | undefined;
}) => {
  // console.log("DetailsScene", token, cast);
  return (
    <View className="relative h-full max-h-[80vh] gap-4 pt-4">
      <ScrollView
        className="flex-1"
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-2">
            <Text>Contract Address</Text>
            <View className="flex-row items-center justify-between gap-2">
              <Text className="line-clamp-1">
                {shortPubKey(token.contractAddress)}
              </Text>
              <Button
                size="icon"
                className="h-6 w-6 p-0"
                onPress={async (event) => {
                  await Clipboard.setStringAsync(
                    token.contractAddress as Address,
                  );
                  Toast.show({
                    type: "info",
                    text1: "Wallet Address Copied!",
                  });
                }}
              >
                <Copy className="size-4 text-white" />
              </Button>
            </View>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text>Token ID</Text>
            <Text> {token.tokenId} </Text>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text>Token Standard</Text>
            <Text>ERC-1155｜ERC-20</Text>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text>Chain</Text>
            <Text>{ATT_CONTRACT_CHAIN.name}</Text>
          </View>
          {tokenInfo?.channel?.lead && (
            <View className="flex-row items-center justify-between gap-2">
              <Text>Channel Host</Text>
              <NeynarCastUserInfo userData={tokenInfo.channel.lead} />
            </View>
          )}
          {tokenInfo?.cast?.author && (
            <View className="flex-row items-center justify-between gap-2">
              <Text>Cast Author</Text>
              <NeynarCastUserInfo userData={tokenInfo.cast.author} />
            </View>
          )}
          {/* {tokenInfo?.curators && tokenInfo.curators.length > 0 && (
            <View className="flex-row items-start justify-between gap-2">
              <Text>Curators</Text>
              <View className="flex items-end gap-4">
                {tokenInfo.curators.map((curator, index) => (
                  <NeynarCastUserInfo key={index} userData={curator} />
                ))}
              </View>
            </View>
          )} */}
        </View>
      </ScrollView>
      <ATTExternalLink
        contractAddress={token.contractAddress}
        tokenId={token.tokenId}
      />
    </View>
  );
};

export const ActivityScene = () => {
  const { token } = useNftCtx();
  return (
    <ScrollView
      className="max-h-[70vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <TokenActivitieList token={token} />
    </ScrollView>
  );
};
