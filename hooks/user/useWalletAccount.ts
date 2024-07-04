import {
  MoonpayConfig as PrivyMoonpayConfig,
  useConnectWallet,
  usePrivy,
  useWallets,
  ConnectedWallet as PrivyConnectedWalletType,
  WalletWithMetadata as PrivyWalletWithMetadata,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { getUserWallets } from "~/utils/privy";

export default function useWalletAccount() {
  const { user, linkWallet } = usePrivy();
  const { connectWallet } = useConnectWallet();
  const { setActiveWallet } = useSetActiveWallet();
  const { wallets: connectedWallets } = useWallets();
  const { address: activeWalletAddress } = useAccount();
  const linkedWallets = getUserWallets(user);

  const activeWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    if (!connectedWallets?.length) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
    if (currentWallet) return currentWallet;
  }, [connectedWallets, activeWalletAddress]);

  const embededWallet = linkedWallets.find(
    (wallet) => wallet.connectorType !== "embedded",
  );

  const connectedExternalWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    if (!connectedWallets?.length) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) =>
        wallet.connectorType !== "embedded" &&
        wallet.connectorType !== "coinbase_wallet",
    );
    if (currentWallet) return currentWallet;
  }, [connectedWallets]);

  const unconnectedLinkedWallets = useMemo(() => {
    return linkedWallets
      .filter(
        (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
      )
      .filter((wallet) => wallet.connectorType !== "embedded");
  }, [linkedWallets, connectedWallets]);

  return {
    connectWallet,
    linkWallet,
    setActiveWallet,
    connectedWallets,
    linkedWallets,
    activeWallet,
    embededWallet,
    connectedExternalWallet,
    unconnectedLinkedWallets,
  };
}

export type ConnectedWallet = PrivyConnectedWalletType;
export type MoonpayConfig = PrivyMoonpayConfig;
export type WalletWithMetadata = PrivyWalletWithMetadata;
