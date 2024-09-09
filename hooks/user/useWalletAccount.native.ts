import {
  useLinkWithSiwe,
  usePrivy
} from "@privy-io/expo";
import { useAccount, useConnect } from "wagmi";

export default function useWalletAccount() {
  const { user } = usePrivy();
  const walletFlow = useLinkWithSiwe()
  const { address: activeWalletAddress } = useAccount();
  const { connect:connectWallet } = useConnect()
  const linkedWallets =
    user?.linked_accounts?.filter((account) => account.type === "wallet") || [];

  const embededWallet = linkedWallets.find(
    (wallet) => wallet.connector_type !== "embedded",
  );

  const linkAccountNum =
    user?.linked_accounts?.filter(
      (account) =>
        !(account.type === "wallet" && account.connector_type === "embedded"),
    ).length || 0;

  return {
    connectWallet,
    linkWallet:walletFlow.linkWithSiwe,
    unlinkWallet:unsurpported,
    setActiveWallet:unsurpported,
    linkAccountNum,
    connectedWallets:[],
    linkedWallets,
    activeWallet:undefined,
    embededWallet,
    connectedExternalWallet:[],
    unconnectedLinkedWallets:[],
  };
}

export type ConnectedWallet = any;
export type WalletWithMetadata = any;
export type MoonpayConfig = any;

const unsurpported = () => {
  console.log("Privy Expo SDK DOES NOT SUPPORT requestSigner");
  return undefined;
}