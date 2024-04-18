import { MoonpayConfig, useWallets } from "@privy-io/react-auth";
import { round } from "lodash";
import { View } from "react-native";
import { useAccount } from "wagmi";
import { Info } from "~/components/common/Icons";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useUserTokens, { TOKENS } from "~/hooks/user/useUserTokens";
import { TokenInfoWithMetadata } from "~/services/user/types";
import TradeButton from "../TradeButton";
import WithdrawButton from "../WithdrawButton";

export default function Balance({ address }: { address: `0x${string}` }) {
  const { userTokens } = useUserTokens(address);
  return (
    <View className="flex w-full gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">Balance</Text>
          <Info size={16} />
        </View>
        <WithdrawButton defaultAddress={address} />
      </View>
      {userTokens.has(TOKENS.NATIVE) && (
        <MyToken
          token={userTokens.get(TOKENS.NATIVE) as TokenInfoWithMetadata}
          action={ACTION_TYPES.BUY}
        />
      )}
      {userTokens.has(TOKENS.DEGEN) && (
        <MyToken
          token={userTokens.get(TOKENS.DEGEN) as TokenInfoWithMetadata}
          action={ACTION_TYPES.SWAP}
        />
      )}
    </View>
  );
}

enum ACTION_TYPES {
  BUY = "Buy",
  SELL = "Sell",
  SWAP = "Swap",
}
function MyToken({
  token,
  action,
}: {
  token: TokenInfoWithMetadata;
  action: ACTION_TYPES;
}) {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const wallet = wallets.find((wallet) => wallet.address === address);
  const fundWalletConfig = {
    currencyCode: "WETH", // Purchase ETH on Base mainnet
    quoteCurrencyAmount: 0.05, // Purchase 0.05 ETH
    paymentMethod: "credit_debit_card", // Purchase with credit or debit card
    uiConfig: {
      accentColor: "#696FFD",
      theme: "light",
    }, // Styling preferences for MoonPay's UIs
  };
  return (
    <View className="flex-row items-center justify-between">
      <TokenInfo name={token.name} logo={token.logo} />
      <View className="flex-row items-center gap-2">
        <Text>
          {round(Number(token.balance), 2)} {token.symbol}
        </Text>
        {wallet &&
          (action === ACTION_TYPES.BUY ? (
            <Button
              variant={"secondary"}
              onPress={async () => {
                // Linking.openURL("https://buy-sandbox.moonpay.com/");
                await wallet.fund({
                  config: fundWalletConfig as MoonpayConfig,
                });
              }}
            >
              <Text>Buy</Text>
            </Button>
          ) : (
            action === ACTION_TYPES.SWAP && (
              <TradeButton
                fromChain={token.chainId}
                fromToken={token.contractAddress as `0x${string}`}
              />
            )
          ))}
      </View>
    </View>
  );
}
