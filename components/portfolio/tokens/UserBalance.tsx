import { MoonpayConfig, useWallets } from "@privy-io/react-auth";
import { round } from "lodash";
import { View } from "react-native";
import { useAccount } from "wagmi";
import { TokenInfo } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useUserTokens, { TOKENS } from "~/hooks/user/useUserTokens";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import TradeButton from "../../trade/TradeButton";
import WithdrawButton from "../../trade/WithdrawButton";

export default function Balance({ address }: { address: `0x${string}` }) {
  const { userTokens } = useUserTokens(address);
  const { address: activeWalletAddress } = useAccount();
  const { wallets: connectedWallets } = useWallets();
  const activeWallet = connectedWallets.find(
    (wallet) => wallet.address === activeWalletAddress,
  );
  return (
    <View className="flex w-full gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-secondary">Balance</Text>
        </View>
        {activeWallet?.connectorType === "embedded" && <WithdrawButton />}
      </View>
      {userTokens.has(TOKENS.NATIVE) && (
        <MyToken
          token={userTokens.get(TOKENS.NATIVE) as TokenWithTradeInfo}
          action={ACTION_TYPES.BUY}
        />
      )}
      {userTokens.has(TOKENS.DEGEN) && (
        <MyToken
          token={userTokens.get(TOKENS.DEGEN) as TokenWithTradeInfo}
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
  token: TokenWithTradeInfo;
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
      <TokenInfo name={token.name} logo={token.logoURI} />
      <View className="flex-row items-center gap-2">
        <Text className="text-lg font-medium">
          {Number(token.balance) && Number(token.balance) > 1
            ? round(Number(token.balance), 2)
            : round(Number(token.balance), 6)}
          {/* {token.symbol} */}
        </Text>
        {wallet &&
          (action === ACTION_TYPES.BUY ? (
            <Button
              size="sm"
              className={cn("w-14")}
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
            action === ACTION_TYPES.SWAP && <TradeButton token1={token} />
          ))}
      </View>
    </View>
  );
}
