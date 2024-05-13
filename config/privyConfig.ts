import type { PrivyClientConfig } from '@privy-io/react-auth';

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
    // Customize Privy's appearance in your app
    appearance: {
        accentColor: "#4C2896",
        logo: "/logo192.png",
    },
    // Create embedded wallets for users who don't have a wallet
    embeddedWallets: {
        createOnLogin: "users-without-wallets",
    },
    fiatOnRamp:{
        useSandbox:true
    },
    loginMethodsAndOrder: {
        primary: [
            "farcaster",
            // "twitter",
            "metamask",
            "detected_wallets",
            "coinbase_wallet",
            "rainbow",
        ],
    },
}