import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { useMemo, useState } from "react";
import { cn } from "~/lib/utils";
// import { clientToSigner } from '@/utils/ethers';

export default function Trade() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex w-full justify-end">
      <button
        type="button"
        className="cursor-pointer items-center rounded-[999px] bg-[white] px-[12px] py-[8px]"
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Trade $Degen
      </button>
      {openModal && <TradeModal open={openModal} setOpen={setOpenModal} />}
    </div>
  );
}

function TradeModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  // const { connectAsync } = useConnect();
  // const { disconnectAsync } = useDisconnect();
  // const { switchChainAsync } = useSwitchChain();
  // const client = useClient();
  // const account = useAccount();

  const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
    integrator: "DegenCast/US3R.NETWORK",
    fromChain: 8453,
    fromToken: "0x0000000000000000000000000000000000000000",
    toChain: 8453,
    toToken: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    containerStyle: {
      padding: "0",
    },
    theme: {
      palette: {
        primary: {
          main: "#F41F4C",
        },
        background: {
          paper: "#1B1E23", // bg color for cards
          default: "#14171A",
        },
        text: {
          primary: "#fff",
          secondary: "#718096",
        },
      },
    },
  };
  const widgetConfig = DEFAULT_WIDGET_CONFIG;
  // TODO: LiFiWidget is NOT support viem until 3.0, try this after 3.0 is released
  // const widgetConfig = useMemo((): WidgetConfig => {
  //   console.log('client', client);
  //   if (!client || !account) {
  //     return defaultWidgetConfig;
  //   }
  //   const signer = clientToSigner(client, account);
  //   console.log('signer', signer);
  //   return {
  //     ...defaultWidgetConfig,
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
    <LiFiWidget integrator="DegenCast/US3R.NETWORK" config={widgetConfig} />
  );
}
