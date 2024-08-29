import {
  ConnectedWallet as PrivyConnectedWalletType,
  MoonpayConfig as PrivyMoonpayConfig,
  WalletWithMetadata as PrivyWalletWithMetadata,
  useConnectWallet,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useCapabilities } from "wagmi/experimental";
import {
  isReportedUserAccount,
  linkUserWallet,
  storeReportedUserAccount,
} from "~/services/user/api";
import { UserAccountType } from "~/services/user/types";

export default function useWalletAccount() {
  const { user, linkWallet, unlinkWallet, ready, authenticated } = usePrivy();
  const { connectWallet } = useConnectWallet();
  const { wallets } = useWallets();

  const connectedWallets = wallets.filter(
    (wallet) => wallet.connectorType !== "embedded",
  );
  const linkedWallets: PrivyWalletWithMetadata[] =
    (user?.linkedAccounts?.filter(
      (account) =>
        account.type === "wallet" && account.connectorType !== "embedded",
    ) as PrivyWalletWithMetadata[]) || [];

  const connectedExternalWallet = useMemo(() => {
    if (!connectedWallets?.length) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) =>
        wallet.connectorType !== "embedded" &&
        wallet.connectorType !== "coinbase_wallet",
    );
    if (currentWallet) return currentWallet;
  }, [connectedWallets]);

  // link connected wallets to degencast user
  useEffect(() => {
    if (!connectedWallets?.length) return undefined;
    const unlinkedConnectedWallets = connectedWallets.filter(
      (wallet) => !linkedWallets.find((w) => w.address === wallet.address),
    );
    if (unlinkedConnectedWallets.length > 0) {
      unlinkedConnectedWallets.forEach((wallet) => {
        if (!isReportedUserAccount(wallet.address, UserAccountType.EVM)) {
          storeReportedUserAccount(wallet.address, UserAccountType.EVM);
          linkUserWallet(wallet.address as Address);
        }
      });
    }
  }, [connectedWallets]);

  const unconnectedLinkedWallets = useMemo(() => {
    return linkedWallets.filter(
      (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
    );
  }, [linkedWallets, connectedWallets]);

  const coinBaseWallet =
    linkedWallets.find(
      (wallet) => wallet.connectorType === "coinbase_wallet",
    ) ||
    connectedWallets.find(
      (wallet) => wallet.connectorType === "coinbase_wallet",
    );

  const injectedWallet = useMemo(
    () =>
      user?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType === "injected",
      ) as unknown as ConnectedWallet,
    [user],
  );

  const linkAccountNum =
    user?.linkedAccounts?.filter(
      (account) =>
        !(account.type === "wallet" && account.connectorType === "embedded"),
    ).length || 0;

  // active wallet
  const { setActiveWallet } = useSetActiveWallet();
  const { address: walletAddress } = useAccount();
  const [freezeAutoSwitchActiveWallet, setFreezeAutoSwitchActiveWallet] =
    useState(false);
  const [activeWalletAddress, setActiveWalletAddress] = useState<Address>();

  useEffect(() => {
    if (freezeAutoSwitchActiveWallet) return;
    setActiveWalletAddress(walletAddress);
  }, [walletAddress, freezeAutoSwitchActiveWallet]);

  const activeWallet = useMemo(() => {
    if (!connectedWallets?.length || !activeWalletAddress) return undefined;
    const currentWallet = connectedWallets.find(
      (wallet) => wallet.address === activeWalletAddress,
    );
    if (currentWallet) return currentWallet;
  }, [connectedWallets, activeWalletAddress]);

  const activeOneWallet = useCallback(() => {
    if (coinBaseWallet) {
      if (
        connectedWallets.find(
          (wallet) => wallet.address === coinBaseWallet.address,
        )
      )
        setActiveWallet(coinBaseWallet as PrivyConnectedWalletType);
      else connectWallet({ suggestedAddress: coinBaseWallet.address });
    } else {
      if (connectedWallets.length > 0) {
        setActiveWallet(connectedWallets[0]);
      } else {
        if (linkedWallets.length > 0) {
          connectWallet({
            suggestedAddress: linkedWallets[0].address,
          });
        }
      }
    }
  }, [connectedWallets, linkedWallets]);
  // avoid active wallet is embedded wallet
  useEffect(() => {
    if (
      ready &&
      authenticated &&
      activeWallet &&
      activeWallet?.connectorType === "embedded"
    )
      activeOneWallet();
  }, [activeWallet, ready, authenticated]);

  //AA
  const { data: capabilities } = useCapabilities({
    account: walletAddress,
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
    setFreezeAutoSwitchActiveWallet,
  };
}

export type ConnectedWallet = PrivyConnectedWalletType;
export type WalletWithMetadata = PrivyWalletWithMetadata;
export type MoonpayConfig = PrivyMoonpayConfig;
