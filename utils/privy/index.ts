import { FarcasterWithMetadata, GoogleOAuthWithMetadata, TwitterOAuthWithMetadata, User, WalletWithMetadata } from "@privy-io/react-auth";

export const getUserAvatar = (user: User | null) => {
    const farcaster = user?.linkedAccounts?.find((account) => account.type === 'farcaster');
    const twitter = user?.linkedAccounts?.find((account) => account.type === 'twitter_oauth');
    return (farcaster as FarcasterWithMetadata)?.pfp || (twitter as TwitterOAuthWithMetadata)?.profilePictureUrl || '';
}

export const getUserName = (user: User | null) => {
    const farcaster = user?.linkedAccounts?.find((account) => account.type === 'farcaster');
    const twitter = user?.linkedAccounts?.find((account) => account.type === 'twitter_oauth');
    const google = user?.linkedAccounts?.find((account) => account.type === 'google_oauth');
    return (farcaster as FarcasterWithMetadata)?.displayName || (twitter as TwitterOAuthWithMetadata)?.name || (google as GoogleOAuthWithMetadata)?.name || '';
}

export const getUserHandle = (user: User | null) => {
    const farcaster = user?.linkedAccounts?.find((account) => account.type === 'farcaster');
    const twitter = user?.linkedAccounts?.find((account) => account.type === 'twitter_oauth');
    const google = user?.linkedAccounts?.find((account) => account.type === 'google_oauth');
    return (farcaster as FarcasterWithMetadata)?.username || (twitter as TwitterOAuthWithMetadata)?.username || (google as GoogleOAuthWithMetadata)?.email || '';
}

export const getUserWallets = (user: User | null) => {
    const wallets = user?.linkedAccounts?.filter((account) => account.type === 'wallet');
    return wallets as WalletWithMetadata[] || [];
}

export const getUserFarcasterAccount = (user: User | null) => {
    const farcasterAccount = user?.linkedAccounts.find(
        (account) => account.type === "farcaster",
    ) as FarcasterWithMetadata;
    return farcasterAccount || null;
}