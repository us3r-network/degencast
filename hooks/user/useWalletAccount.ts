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
import { PAYMASTER_AND_BUNDLER_ENDPOINT } from "~/constants";
import {
  isReportedUserAccount,
  linkUserWallet,
  storeReportedUserAccount,
} from "~/services/user/api";
import { UserAccountType } from "~/services/user/types";

export default function useWalletAccount() {
  const { user, ready, authenticated } = usePrivy();
  const { connectWallet } = useConnectWallet();

  //connencted wallets
  const { wallets: connectedWallets } = useWallets();
  const connectedExternalWallet = useMemo(
    () => connectedWallets,
    // connectedWallets.filter((wallet) => wallet.connectorType !== "embedded"),
    [connectedWallets],
  );

  // linked wallets
  const linkedWallets: PrivyWalletWithMetadata[] =
    (user?.linkedAccounts?.filter(
      (account) => account.type === "wallet",
      //  && account.connectorType !== "embedded",
    ) as PrivyWalletWithMetadata[]) || [];

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
          if (authenticated) linkUserWallet(wallet.address as Address);
        }
      });
    }
  }, [connectedWallets, authenticated]);

  const unconnectedLinkedWallets = useMemo(
    () =>
      linkedWallets.filter(
        (wallet) => !connectedWallets.find((w) => w.address === wallet.address),
      ),
    [linkedWallets, connectedWallets],
  );

  // specific wallet
  const linkedCoinBaseWallet = linkedWallets.find(
    (wallet) => wallet.connectorType === "coinbase_wallet",
  );
  const connectedCoinBaseWallet = connectedWallets.find(
    (wallet) => wallet.connectorType === "coinbase_wallet",
  );

  const linkedInjectedWallet = linkedWallets.find(
    (wallet) => wallet.connectorType === "injected",
  );
  const connectedInjectedWallet = connectedWallets.find(
    (wallet) => wallet.connectorType === "injected",
  );

  const linkAccountNum =
    user?.linkedAccounts?.filter(
      (account) => !(account.type === "wallet"),
      // !(account.type === "wallet" && account.connectorType === "embedded"),
    ).length || 0;

  // active wallet
  const { setActiveWallet } = useSetActiveWallet();
  const { address: walletAddress } = useAccount();
  const [freezeAutoSwitchActiveWallet, setFreezeAutoSwitchActiveWallet] =
    useState(false);
  const [activeWalletAddress, setActiveWalletAddress] = useState<Address>();

  useEffect(() => {
    if (freezeAutoSwitchActiveWallet) return;
    // console.log("setActiveWalletAddress", walletAddress);
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
    // console.log("activeOneWallet");
    if (connectedCoinBaseWallet) setActiveWallet(connectedCoinBaseWallet);
    else if (connectedInjectedWallet) setActiveWallet(connectedInjectedWallet);
    else if (linkedCoinBaseWallet)
      connectWallet({ suggestedAddress: linkedCoinBaseWallet.address });
    else if (linkedInjectedWallet)
      connectWallet({ suggestedAddress: linkedInjectedWallet.address });
  }, [
    connectedCoinBaseWallet,
    connectedInjectedWallet,
    linkedCoinBaseWallet,
    linkedInjectedWallet,
  ]);
  // avoid active wallet is embedded wallet
  // useEffect(() => {
  //   if (!ready || !authenticated) return;
  //   console.log("activeWallet", activeWallet);
  //   if (activeWallet && activeWallet.connectorType === "embedded") {
  //     activeOneWallet();
  //   }
  // }, [activeWallet, ready, authenticated]);

  //AA
  const { data: availableCapabilities } = useCapabilities({
    account: walletAddress,
  });
  const supportAtomicBatch = useCallback(
    (chainId: number | undefined) => {
      if (availableCapabilities && chainId) {
        const capabilitiesForChain = availableCapabilities[chainId];
        if (capabilitiesForChain?.atomicBatch?.supported) {
          return true;
        }
      }
      return false;
    },
    [availableCapabilities],
  );
  const supportAuxiliaryFunds = useCallback(
    (chainId: number | undefined) => {
      if (availableCapabilities && chainId) {
        const capabilitiesForChain = availableCapabilities[chainId];
        if (capabilitiesForChain?.auxiliaryFunds?.supported) {
          return true;
        }
      }
      return false;
    },
    [availableCapabilities],
  );
  const getPaymasterService = useCallback(
    (chainId: number | undefined) => {
      if (availableCapabilities && chainId) {
        const capabilitiesForChain = availableCapabilities[chainId];
        if (capabilitiesForChain?.paymasterService?.supported) {
          return {
            paymasterService: {
              url: PAYMASTER_AND_BUNDLER_ENDPOINT,
            },
          };
        }
      }
      return {};
    },
    [availableCapabilities],
  );
  return {
    linkAccountNum,
    connectedWallets,
    connectedExternalWallet,
    linkedWallets,
    unconnectedLinkedWallets,
    coinBaseWallet: linkedCoinBaseWallet || connectedCoinBaseWallet,
    injectedWallet: linkedInjectedWallet,
    connectedInjectedWallet,
    activeWallet,
    // isConnected: !!activeWallet && activeWallet.connectorType !== "embedded",
    isConnected: !!activeWallet,
    connectWallet,
    setActiveWallet,
    activeOneWallet,
    setFreezeAutoSwitchActiveWallet,
    supportAtomicBatch,
    supportAuxiliaryFunds,
    getPaymasterService,
  };
}

export type ConnectedWallet = PrivyConnectedWalletType;
export type WalletWithMetadata = PrivyWalletWithMetadata;
export type MoonpayConfig = PrivyMoonpayConfig;
