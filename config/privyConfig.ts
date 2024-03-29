import type { PrivyClientConfig } from '@privy-io/react-auth';

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
    // Customize Privy's appearance in your app
    appearance: {
        accentColor: "#676FFF",
        logo: "https://u3.xyz/logo192.png",
    },
    // Create embedded wallets for users who don't have a wallet
    embeddedWallets: {
        createOnLogin: "users-without-wallets",
    },
    loginMethodsAndOrder: {
        primary: [
            "farcaster",
            "twitter",
            "detected_wallets",
            "metamask",
            "coinbase_wallet",
            "rainbow",
        ],
    },
}