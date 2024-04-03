import { OwnedToken } from "alchemy-sdk";
import { round } from "lodash";
import React from "react";
import { Linking, Text, View } from "react-native";
import { useAccount } from "wagmi";
import useUserTokens from "~/hooks/user/useUserTokens";
import { Info } from "../../Icons";
import { Button } from "../../ui/button";
import { TokenInfo } from "./TokenInfo";
import {
  MoonpayConfig,
  MoonpayCurrencyCode,
  useWallets,
} from "@privy-io/react-auth";
import SendButton from "../SendButton";

const tokenAddress: string[] = [
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // Degen
];

export default function Balance() {
  const { address } = useAccount();
  const { nativeTokens, tokens } = useUserTokens(address || "0x", tokenAddress);
  return (
    <View className="flex w-full gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">Balance</Text>
          <Info size={16} />
        </View>
        <SendButton defaultAddress={address || "0x"} tokens={[...nativeTokens, ...tokens]}/>
      </View>
      {[...nativeTokens, ...tokens].map((token) => (
        <MyToken key={token.contractAddress} {...token} />
      ))}
    </View>
  );
}

function MyToken(token: OwnedToken) {
  // const { wallets } = useWallets();
  // const { address } = useAccount();
  // const wallet = wallets.find((wallet) => wallet.address === address);
  // const fundWalletConfig = {
  //   currencyCode: "ETH_ETHEREUM", // Purchase ETH on Ethereum mainnet
  //   quoteCurrencyAmount: 0.05, // Purchase 0.05 ETH
  //   paymentMethod: "credit_debit_card", // Purchase with credit or debit card
  //   uiConfig: {
  //     accentColor: "#696FFD",
  //     theme: "light",
  //   }, // Styling preferences for MoonPay's UIs
  // };
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo {...token} />
      <View className="flex-row items-center gap-2">
        <Text>
          {round(Number(token.balance), 2)} {token.symbol}
        </Text>
        {/* {wallet && ( */}
        <Button
          className="bg-secondary font-bold"
          onPress={async () => {
            Linking.openURL("https://buy-sandbox.moonpay.com/");
            // await wallet.fund({ config: fundWalletConfig as MoonpayConfig });
          }}
        >
          <Text className="font-bold text-secondary-foreground">Buy</Text>
        </Button>
        {/* )} */}
      </View>
    </View>
  );
}
