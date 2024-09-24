# DegenCast: Curate, Mint, and Trade Onchain Content 🎩✨

DegenCast lets you curate content onchain by minting ERC1155-ERC20 hybrid tokens on a bonding curve, which are later launched on UniswapV3. Each piece of curated content undergoes a proposal process secured by an economic game inspired by Kleros, ensuring only high-quality contributions make it through. Whether you’re a creator or a curator, DegenCast offers a seamless way to engage with and monetize top-tier content in a decentralized ecosystem.

Degencast is built as a cross platform a mobile and web application built with React Native and Expo, on Farcaster ecosystem and powered by $DEGEN.

## Introduction 🚀

Degencast revolutionizes content curation in the social media landscape by combining the power of decentralized finance (DeFi) 💰 with community-driven content selection 🗳️. At its core, Degencast introduces innovative features that empower users to curate and value content collectively:

- Channel Content Contribution NFTs 🖼️: Users can propose to transform high-quality casts (posts) into Channel NFTs, creating a new paradigm for content curation where the community decides what content is most valuable.
- Community-Driven Contribution 👥: Degencast implements a unique challenge system for proposal approval, ensuring that content curation is a collaborative effort driven by community consensus.
- Curator Rewards 🏆: Top curators (including the proposer and early supporters) are rewarded with a share of the transaction fees, encouraging active participation in content curation.

By tokenizing content curation, Degencast creates a more engaging and rewarding social media experience where users have a direct stake in the quality of content shared on the platform. This approach not only enhances the overall content quality but also fosters a sense of ownership and community among users. 🌟

## Table of Contents 📚

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [Key Components](#key-components)
8. [Contributing](#contributing)
9. [License](#license)

## Features 🎉

- User authentication with Privy 🔐
- Farcaster integration for social interactions 💬
- Community management and exploration 🌍
- Cryptocurrency trading and portfolio management 📊
- Real-time chat and messaging 📨
- Customizable UI components 🎨
- Cross-platform support (iOS, Android, Web) 📱💻
- Channel NFT creation and management 🏛️
- Community-driven content curation 👨‍👩‍👧‍👦
- Tokenized engagement with $CAST 💎
- Bonding curve for Channel NFTs 📈
- Integration with Uniswap v3 for liquidity 🌊

## Technology Stack 🛠️

- React Native 📱
- Expo 🚀
- Redux Toolkit for state management 🗃️
- Wagmi for Ethereum interactions ⚡
- Privy for authentication 🔑
- NativeWind for styling 💅
- Radix UI primitives 🧱
- Lucide React Native for icons 🎭
- Zora Protocol SDK for NFT creation 🖼️
- Arweave for decentralized storage 💾

## Project Structure 🏗️

The project follows a modular structure with the following main directories:

- `app`: Contains the main application routes and screens 📱
- `components`: Reusable UI components 🧩
- `config`: Configuration files for various services ⚙️
- `constants`: Application-wide constants 📊
- `features`: Redux slices for different features 🍰
- `hooks`: Custom React hooks 🎣
- `lib`: Utility libraries and wrappers 📚
- `public`: Static assets for the web version 🖼️
- `services`: API services and types 🌐
- `store`: Redux store configuration 🏪
- `utils`: Utility functions 🛠️

## Setup and Installation 🚀

1. Clone the repository 📂
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see [Configuration](#configuration)) ⚙️
4. Run the development server:
   ```
   npm start
   ```

## Configuration ⚙️

Create a `.env` file in the root directory with the following variables:

```
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_DEGENCAST_WEB_HOST=
EXPO_PUBLIC_DEGENCAST_FRAME_HOST=
EXPO_PUBLIC_PRIVY_APP_ID=
EXPO_PUBLIC_HTTP_HMAC_KEY=
EXPO_PUBLIC_INVITE_ONLY=
```

## Usage 🚀

The application can be run on different platforms:

- iOS: `npm run ios` ��
- Android: `npm run android` ��
- Web: `npm run web` ��

## Key Components 🧩

### Channel NFTs 🖼️

Channel NFTs represent curated content within Degencast. Users can propose to turn high-quality casts into Channel NFTs, which are then subject to community approval.

The challenge process for Channel NFTs works as follows:

- **Propose**: Users can propose to turn a high-quality cast into a Channel NFT.
- **Approve**: If the proposal is approved, it becomes a Channel NFT.
- **Cost**: The minimum challenge cost is equal to the NFT price.
- **Weight**: The challenge weight is calculated as the square root of the amount spent.
- **Challenge**: Disagreements extend the countdown by 1 hour. Each account can challenge once per phase.
- **Win Condition**: A stance must have twice the weight of the opposing stance to win.
- **Result**: The final stance is determined after the countdown ends.
- **Funds Distribution**: Winners receive their principal back, while losers' funds are distributed to winners based on weight.
- **Token Ratio**: Each Channel NFT represents 1000 Channel Tokens.
- **Curation**: After approval, the top 10 upvoters (including the proposer) become curators, with earlier supporters earning more revenue.
- **Transaction Fees**: Fees are distributed as follows: Degencast 1%, Channel host 2%, Creator 3%, Curators 4%.
- **Bonding Curve**: All Channel NFTs share the same channel bonding curve.
- **Liquidity Provision**: When the bonding curve reaches a market cap of 4,206,900 DEGEN, all liquidity is deposited into Uniswap v3.
- **Post-Launch**: After the token launch, each Channel NFT still represents 1000 Channel Tokens.

### Contribution Process 🗳️

The curation process involves proposing, challenging, and approving content to become Channel NFTs. This process ensures that only the most valuable content is tokenized and rewarded.

- Contribution NFT = 1000 Contribution Token.
- NFT transaction fee: Degencast 1%, Channel host 2%, Creator 3%, Curators 4%.
- All Contribution NFTs share the same bonding curve.
- When bonding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.
- After token launch, Contribution NFT = 1000 Contribution Token.

### Content Creation ✍️

Users can create casts (posts) within the Degencast ecosystem, which can then be proposed for curation.

```18:36:components/social-farcaster/Editor.tsx
export default function Editor({
  text,
  setText,
  images,
  setImages,
  channel,
  setChannel,
  previewComponent,
  placeholder = "Create a cast...",
}: {
  text: string;
  setText: (text: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
  channel: WarpcastChannel;
  setChannel: (channel: WarpcastChannel) => void;
  previewComponent?: React.ReactNode;
  placeholder?: string;
}) {
```

### NFT Creation 🎨

When a cast is approved to become a Channel NFT, the platform uses the Zora Protocol SDK to create and mint the NFT.

```179:222:hooks/social-farcaster/cast-nft/useCreateNew1155Token.ts
async function createNew1155Token({
  publicClient,
  walletClient,
  contractAddress,
  contractMetadataURI,
  tokenMetadataURI,
}: {
  publicClient: PublicClient;
  walletClient: WalletClient;
  contractAddress?: `0x${string}`;
  contractMetadataURI?: string;
  tokenMetadataURI: string;
}) {
  if (!contractAddress && !contractMetadataURI) {
    throw new Error("Contract address or metadata URI is required");
  }
  const addresses = await walletClient.getAddresses();
  const chainId = await walletClient.getChainId();
  const creatorAccount = addresses[0]!;
  const creatorClient = create1155CreatorClient({ publicClient });
  const { request, contractAddress: collectionContractAddress } =
    await creatorClient.createNew1155Token({
      contract: contractAddress! || {
        name: CAST_COLLECTION_NAME,
        uri: contractMetadataURI,
      },
      tokenMetadataURI: tokenMetadataURI,
      account: creatorAccount,
      mintToCreatorCount: 1,
      createReferral: ZORA_CREATE_REFERRAL,
    });
  const { request: simulateRequest } =
    await publicClient.simulateContract(request);
  const hash = await walletClient.writeContract(simulateRequest);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return {
    receipt,
    tokenInfo: {
      contractAddress: collectionContractAddress,
      creatorAccount,
      chainId,
    },
  };
}
```

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository 🍴
2. Create a new branch 🌿
3. Make your changes 💻
4. Submit a pull request 🚀

## License 📜

MIT

---

This README provides a comprehensive overview of the Degencast project, its features, and how to set it up and use it. For more detailed information on specific components or features, please refer to the corresponding files in the project structure. Happy coding! 🎉👨‍💻👩‍💻
