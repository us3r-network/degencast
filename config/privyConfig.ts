import type { PrivyClientConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
  // Customize Privy's appearance in your app
  appearance: {
    accentColor: "#4C2896",
    logo: "/logo192.png",
    showWalletLoginFirst: false,
    walletList: [
      "metamask",
      "coinbase_wallet",
      "wallet_connect",
      "detected_wallets",
      "rainbow",
    ],
  },
  // Create embedded wallets for users who don't have a wallet
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  externalWallets: {
    coinbaseWallet: {
      // Valid connection options include 'eoaOnly' (default), 'smartWalletOnly', or 'all'
      connectionOptions: "all",
    },
  },
  fiatOnRamp: {
    useSandbox: true,
  },
  loginMethods: ["wallet", "farcaster"],
  loginMethodsAndOrder: {
    primary: [
      "farcaster",
      // "twitter",
      "metamask",
      "coinbase_wallet",
      "wallet_connect",
      "detected_wallets",
      "rainbow",
    ],
  },
};
