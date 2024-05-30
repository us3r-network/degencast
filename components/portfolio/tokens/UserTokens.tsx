import { View } from "react-native";
import { TokenInfo } from "~/components/common/TokenInfo";
import {
  ERC20TokenBalance,
  NativeTokenBalance,
} from "~/components/trade/TokenBalance";
import { TextClassContext } from "~/components/ui/text";
import { DEGEN_METADATA, NATIVE_TOKEN_METADATA } from "~/constants";

export default function UserTokens({ address }: { address: `0x${string}` }) {
  return (
    <TextClassContext.Provider value="text-foreground">
      <View className="w-full flex-row gap-2">
        <View className="flex flex-1 gap-2 rounded-lg bg-blue-100 p-4">
          <TokenInfo
            name={NATIVE_TOKEN_METADATA.name}
            logo={NATIVE_TOKEN_METADATA.logoURI}
            symbol={NATIVE_TOKEN_METADATA.symbol}
          />
          <NativeTokenBalance
            chainId={NATIVE_TOKEN_METADATA.chainId}
            address={address}
            variant="big"
          />
        </View>
        <View className="flex flex-1 gap-2 rounded-lg bg-purple-100 p-4">
          <TokenInfo
            name={DEGEN_METADATA.name}
            logo={DEGEN_METADATA.logoURI}
            symbol={DEGEN_METADATA.symbol}
          />
          <ERC20TokenBalance
            token={DEGEN_METADATA}
            address={address}
            variant="big"
          />
        </View>
      </View>
    </TextClassContext.Provider>
  );
}
