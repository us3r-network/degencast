import { LiFiWidget, WidgetConfig } from "@lifi/widget";
// import { useSwitchChain } from "wagmi";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN, NATIVE_TOKEN } from "~/constants";
import About from "../common/About";
import { View } from "react-native";

export default function TradeButton({
  fromChain,
  fromToken,
  toChain = DEFAULT_CHAIN.id,
  toToken = NATIVE_TOKEN,
}: {
  fromChain: number;
  fromToken: `0x${string}`;
  toChain?: number;
  toToken?: `0x${string}`;
}) {
  // return (
  //   <Button
  //     variant={"secondary"}
  //     onPress={() => {
  //       console.log("Trade button pressed");
  //       Linking.openURL("https://app.uniswap.org/");
  //     }}
  //   >
  //     <Text className="text-xs font-bold text-secondary-foreground">Trade</Text>
  //   </Button>
  // );
  // const { switchChain } = useSwitchChain();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          // onPress={() => switchChain({ chainId: fromChain })}
        >
          <Text>Trade</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen border-none p-2">
        <Trade
          fromChain={fromChain}
          fromToken={fromToken}
          toChain={toChain}
          toToken={toToken}
        />
        <View className="p-4">
          <About title="Swap & Earn" info={TRADE_INFO} />
        </View>
      </DialogContent>
    </Dialog>
  );
}

const TRADE_INFO = ["Swap 0.01 ETH = 500 Points"];

function Trade({
  fromChain,
  fromToken,
  toChain,
  toToken,
}: {
  fromChain: number;
  fromToken: `0x${string}`;
  toChain: number;
  toToken: `0x${string}`;
}) {
  // console.log("Trade", fromChain, fromToken, toChain, toToken)
  const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
    integrator: "DegenCast/US3R.NETWORK",
    fromChain,
    fromToken,
    toChain,
    toToken,
    theme: {
      palette: {
        primary: {
          main: "#A36EFE",
        },
        background: {
          paper: "#4C2896", // bg color for cards
          default: "#4C2896",
        },
        text: {
          primary: "#fff",
          secondary: "#A36EFE",
        },
      },
    },
  };
  return (
    <LiFiWidget
      integrator="DegenCast/US3R.NETWORK"
      config={DEFAULT_WIDGET_CONFIG}
    />
  );
}
