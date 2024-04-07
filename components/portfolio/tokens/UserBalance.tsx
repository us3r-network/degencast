import { MoonpayConfig, useWallets } from "@privy-io/react-auth";
import { OwnedToken } from "alchemy-sdk";
import { round } from "lodash";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useAccount } from "wagmi";
import useUserBalance from "~/hooks/user/useUserBalance";
import useUserERC20Tokens from "~/hooks/user/useUserERC20Tokens";
import { Info } from "../../Icons";
import { Button } from "../../ui/button";
import SendButton from "../SendButton";
import { TokenInfo } from "./TokenInfo";

const TOKEN_ADDRESS: string[] = [
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // Degen
];

export default function Balance({ address }: { address: `0x${string}` }) {
  // const { tokens: nativeTokens, fetch:fetchNativeTokens } = useUserBalance(address);
  const { tokens: erc20Tokens, fetch: fetchERC20Tokens } = useUserERC20Tokens();
  console.log("erc20Tokens", address, erc20Tokens);
  useEffect(() => {
    console.log("Balance useEffects", address, erc20Tokens);
    if (!address) return;
    // fetchNativeTokens(address);
    // fetchERC20Tokens(address, TOKEN_ADDRESS).catch(console.error);

  }, [address]);
  return (
    <View className="flex w-full gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">Balance</Text>
          <Info size={16} />
        </View>
        {/* <SendButton
          defaultAddress={address}
          tokens={[...nativeTokens, ...erc20Tokens]}
        /> */}
      </View>
      {/* {nativeTokens && nativeTokens.length > 0 && (
        <MyToken token={nativeTokens[0]} />
      )} */}
      {erc20Tokens &&
        erc20Tokens.length > 0 &&
        erc20Tokens.map((token) => (
          <MyToken key={token.contractAddress} token={token} />
        ))}
    </View>
  );
}

function MyToken({ token }: { token: OwnedToken }) {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const wallet = wallets.find((wallet) => wallet.address === address);
  const fundWalletConfig = {
    currencyCode: "ETH_ETHEREUM", // Purchase ETH on Ethereum mainnet
    quoteCurrencyAmount: 0.05, // Purchase 0.05 ETH
    paymentMethod: "credit_debit_card", // Purchase with credit or debit card
    uiConfig: {
      accentColor: "#696FFD",
      theme: "light",
    }, // Styling preferences for MoonPay's UIs
  };
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo {...token} />
      <View className="flex-row items-center gap-2">
        <Text>
          {round(Number(token.balance), 2)} {token.symbol}
        </Text>
        {wallet && (
          <Button
            className="bg-secondary font-bold"
            onPress={async () => {
              // Linking.openURL("https://buy-sandbox.moonpay.com/");
              await wallet.fund({ config: fundWalletConfig as MoonpayConfig });
            }}
          >
            <Text className="font-bold text-secondary-foreground">Buy</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
