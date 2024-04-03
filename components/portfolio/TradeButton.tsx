import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { useState } from "react";
// import { clientToSigner } from '@/utils/ethers';
import { Text } from "react-native";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { base } from "viem/chains";

export const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000";
export default function TradeButton({
  fromChain,
  fromToken,
  toChain = base.id,
  toToken = NATIVE_TOKEN,
}: {
  fromChain: number;
  fromToken: `0x${string}`;
  toChain: number;
  toToken: `0x${string}`;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Button
          className="bg-secondary"
          onPress={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Text className="font-bold text-secondary-foreground">Trade</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
  toChain = 8453,
  toToken = "0x0000000000000000000000000000000000000000",
}: {
  fromChain: number;
  fromToken: `0x${string}`;
  toChain: number;
  toToken: `0x${string}`;
}) {
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
  // TODO: LiFiWidget is NOT support viem until 3.0, try this after 3.0 is released
  // const { connectAsync } = useConnect();
  // const { disconnectAsync } = useDisconnect();
  // const { switchChainAsync } = useSwitchChain();
  // const client = useClient();
  // const account = useAccount();
  // const widgetConfig = useMemo((): WidgetConfig => {
  //   console.log('client', client);
  //   if (!client || !account) {
  //     return DEFAULT_WIDGET_CONFIG;
  //   }
  //   const signer = clientToSigner(client, account);
  //   console.log('signer', signer);
  //   return {
  //     ...DEFAULT_WIDGET_CONFIG,
  //     walletManagement: {
  //       signer,
  //       connect: async () => {
  //         await connectAsync();
  //         return signer;
  //       },
  //       disconnect: async () => {
  //         await disconnectAsync();
  //       },
  //       switchChain: async (chainId: number) => {
  //         await switchChainAsync({ chainId });
  //         if (signer) {
  //           return signer;
  //         }
  //         throw Error('No signer object is found after the chain switch.');
  //       },
  //     },
  //   };
  // }, [client, account, connectAsync, disconnectAsync, switchChainAsync]);
  return (
    <LiFiWidget integrator="DegenCast/US3R.NETWORK" config={DEFAULT_WIDGET_CONFIG} />
  );
}
