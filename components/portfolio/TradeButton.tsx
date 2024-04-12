import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { Text } from "react-native";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DEFAULT_CHAIN, NATIVE_TOKEN } from "~/constants";

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
  //     className="w-14 bg-secondary"
  //     onPress={() => {
  //       console.log("Trade button pressed");
  //       Linking.openURL("https://app.uniswap.org/");
  //     }}
  //   >
  //     <Text className="text-xs font-bold text-secondary-foreground">Trade</Text>
  //   </Button>
  // );
  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Button className="bg-secondary">
          <Text className="font-bold text-secondary-foreground">Trade</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="box-border max-w-screen text-primary-foreground">
        <Trade
          fromChain={fromChain}
          fromToken={fromToken}
          toChain={toChain}
          toToken={toToken}
        />
      </DialogContent>
    </Dialog>
  );
}

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
  console.log("Trade", fromChain, fromToken, toChain, toToken)
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
