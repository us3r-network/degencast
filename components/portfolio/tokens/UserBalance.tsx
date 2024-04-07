import { MoonpayConfig, useWallets } from "@privy-io/react-auth";
import { OwnedToken } from "alchemy-sdk";
import { round } from "lodash";
import { Text, View } from "react-native";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { Info } from "../../Icons";
import { Button } from "../../ui/button";
import SendButton from "../SendButton";
import { TokenInfo } from "./TokenInfo";
import { base } from "viem/chains";
import { erc20Abi, formatUnits } from "viem";

const DEGEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"; // Degen

export default function Balance({ address }: { address: `0x${string}` }) {
  const { data: nativeToken } = useBalance({
    address,
    chainId: base.id,
  });
  const { data: degenToken } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address], 
      },
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: DEGEN_ADDRESS,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  // console.log("balance: ", nativeToken, degenToken);
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
      {nativeToken && (
        <MyToken
          token={
            {
              name: "Ethereum",
              rawBalance: nativeToken.value,
              decimals: nativeToken.decimals,
              balance: formatUnits(nativeToken.value, nativeToken.decimals),
              symbol: nativeToken.symbol,
              logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
            } as unknown as OwnedToken
          }
        />
      )}
      {degenToken && (
        <MyToken
          token={
            {
              name: degenToken[0],
              rawBalance: degenToken[1],
              decimals: degenToken[2],
              balance: formatUnits(degenToken[1], degenToken[2]),
              symbol: degenToken[3],
              logo: "/assets/images/degen-icon.png",
            } as unknown as OwnedToken
          }
        />
      )}
    </View>
  );
}

function MyToken({ token }: { token: OwnedToken }) {
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
