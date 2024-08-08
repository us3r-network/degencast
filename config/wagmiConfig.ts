import { base, baseSepolia, mainnet, sepolia, polygon } from "viem/chains";
import { http } from "wagmi";

import { createConfig } from "lib/privy";

// Replace these with your app's chains

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [polygon.id]: http(),
  },
});
