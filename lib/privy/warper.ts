import { ConnectedWallet } from "@privy-io/react-auth";

export { PrivyProvider } from "@privy-io/expo";
export { getAccessToken, usePrivy } from "@privy-io/react-auth";
export {
  useConnectWallet,
  useCreateWallet,
  useFarcasterSigner,
  useLinkAccount,
  useLogin,
  useLogout,
  useWallets,
} from "@privy-io/react-auth";
export { WagmiProvider, createConfig } from "wagmi";
export const useSetActiveWallet = () => {
  const setActiveWallet = (wallet: ConnectedWallet) => Promise<void>;
  return { setActiveWallet };
};
export type { User } from "@privy-io/expo";
export type {
  ConnectedWallet,
  FarcasterWithMetadata,
  MoonpayConfig,
  PrivyClientConfig,
  WalletWithMetadata,
} from "@privy-io/react-auth";
