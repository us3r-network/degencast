import {
  ConnectedWallet as PrivyConnectedWalletType,
  MoonpayConfig as PrivyMoonpayConfig,
  WalletWithMetadata as PrivyWalletWithMetadata,
  useConnectWallet,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export default function useWalletAccount() {
  const { user, linkWallet, unlinkWallet } = usePrivy();
  const { connectWallet } = useConnectWallet();
  const { setActiveWallet } = useSetActiveWallet();
  const { wallets: connectedWallets } = useWallets();
  const { address: activeWalletAddress } = useAccount();

  const linkedWallets =
    user?.linkedAccounts?.filter((account) => account.type === "wallet") || [];

  const embededWallet = linkedWallets.find(
    (wallet) => wallet.connectorType !== "embedded",
  );

  const activeWallet = useMemo(() => {
    // console.log("activeWalletAddress", connectedWallets, activeWalletAddress);
    if (!connectedWallets?.length) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
    if (currentWallet) return currentWallet;
  }, [connectedWallets, activeWalletAddress]);

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

  const linkAccountNum =
    user?.linkedAccounts?.filter(
      (account) =>
        !(account.type === "wallet" && account.connectorType === "embedded"),
    ).length || 0;

  return {
    connectWallet,
    linkWallet,
    unlinkWallet,
    setActiveWallet,
    linkAccountNum,
    connectedWallets,
    linkedWallets,
    activeWallet,
    embededWallet,
    connectedExternalWallet,
    unconnectedLinkedWallets,
  };
}

export type ConnectedWallet = PrivyConnectedWalletType;
export type WalletWithMetadata = PrivyWalletWithMetadata;
export type MoonpayConfig = PrivyMoonpayConfig;
