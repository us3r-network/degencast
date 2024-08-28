import {
  ConnectedWallet as PrivyConnectedWalletType,
  MoonpayConfig as PrivyMoonpayConfig,
  WalletWithMetadata as PrivyWalletWithMetadata,
  useConnectWallet,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useCallback, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";

export default function useWalletAccount() {
  const { user, linkWallet, unlinkWallet, ready, authenticated } = usePrivy();
  const { connectWallet } = useConnectWallet();
  const { setActiveWallet } = useSetActiveWallet();
  const { wallets } = useWallets();
  const { address: activeWalletAddress } = useAccount();
  const connectedWallets = wallets.filter(
    (wallet) => wallet.connectorType !== "embedded",
  );
  const linkedWallets: PrivyWalletWithMetadata[] =
    (user?.linkedAccounts?.filter(
      (account) =>
        account.type === "wallet" && account.connectorType !== "embedded",
    ) as PrivyWalletWithMetadata[]) || [];

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
    return linkedWallets.filter(
      (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
    );
  }, [linkedWallets, connectedWallets]);

  const linkAccountNum =
    user?.linkedAccounts?.filter(
      (account) =>
        !(account.type === "wallet" && account.connectorType === "embedded"),
    ).length || 0;

  const { address } = useAccount();
  const { data: capabilities } = useCapabilities({
    account: address,
  });
  const supportAtomicBatch = useCallback(
    (chainId: number) => {
      if (capabilities && chainId) {
        const capability = capabilities[chainId];
        if (capability && capability.atomicBatch?.supported) {
          return true;
        }
      }
      return false;
    },
    [capabilities],
  );
  const coinBaseWallet =
    linkedWallets.find(
      (wallet) => wallet.connectorType === "coinbase_wallet",
    ) ||
    connectedWallets.find(
      (wallet) => wallet.connectorType === "coinbase_wallet",
    );

  const activeOneWallet = useCallback(() => {
    if (coinBaseWallet) {
      if (
        connectedWallets.find(
          (wallet) => wallet.address === coinBaseWallet.address,
        )
      )
        setActiveWallet(coinBaseWallet as PrivyConnectedWalletType);
      else connectWallet({ suggestedAddress: coinBaseWallet.address });
    }
    if (connectedWallets.length > 0) {
      setActiveWallet(connectedWallets[0]);
    } else {
      if (linkedWallets.length > 0) {
        console.log(
          "connectWallet",
          linkedWallets,
          connectedWallets,
          activeWallet,
        );
        connectWallet({
          suggestedAddress: linkedWallets[0].address,
        });
      }
    }
  }, [connectedWallets, linkedWallets]);

  const injectedWallet = useMemo(
    () =>
      user?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType === "injected",
      ) as unknown as ConnectedWallet,
    [user],
  );

  useEffect(() => {
    if (
      ready &&
      authenticated &&
      activeWallet &&
      activeWallet?.connectorType === "embedded"
    )
      activeOneWallet();
  }, [activeWallet, ready, authenticated]);
  // console.log("supportAtomicBatch", supportAtomicBatch);
  return {
    connectWallet,
    linkWallet,
    unlinkWallet,
    setActiveWallet,
    linkAccountNum,
    connectedWallets,
    linkedWallets,
    activeWallet,
    connectedExternalWallet,
    unconnectedLinkedWallets,
    supportAtomicBatch,
    coinBaseWallet,
    injectedWallet,
    activeOneWallet,
  };
}

export type ConnectedWallet = PrivyConnectedWalletType;
export type WalletWithMetadata = PrivyWalletWithMetadata;
export type MoonpayConfig = PrivyMoonpayConfig;
