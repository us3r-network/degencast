import { FarcasterWithMetadata, useCreateWallet, useExperimentalFarcasterSigner, useLinkAccount, usePrivy, useWallets } from "@privy-io/react-auth"


export default function useFarcasterWrite() {
    const { user } = usePrivy();

    const { createWallet } = useCreateWallet();
    const { wallets } = useWallets();
    const embededWallet = wallets.find((wallet) => wallet.connectorType === 'embedded');

    const linkHanler = {
        onSuccess: (user: unknown) => {
            console.log('Linked farcaster account',user);
            prepareWrite();
        },
        onError: (error: unknown) => {
            console.error('Failed to link farcaster account', error);
        }
    }
    const { linkFarcaster } = useLinkAccount(linkHanler);

    const { submitCast,
        removeCast,
        likeCast,
        recastCast,
        followUser,
        unfollowUser,
        requestFarcasterSigner } = useExperimentalFarcasterSigner();
    const farcasterAccount = user?.linkedAccounts.find((account) => account.type === 'farcaster') as FarcasterWithMetadata;

    const prepareWrite = async () => {
        if (!embededWallet) {
            console.log('Creating embeded wallet');
            await createWallet();
        }
        if (!farcasterAccount) {
            console.log('Linking farcaster');
            await linkFarcaster();
            return false;
        } else {
            if (!farcasterAccount?.signerPublicKey) {
                console.log('Requesting farcaster signer');
                await requestFarcasterSigner();
                return false;
            }
        }
        return true;
    }
    return {
        // todo: add more post support!
        submitCast: async (text: string) => {
            const canWrite = await prepareWrite();
            if (canWrite) await submitCast({ text });
        },
        removeCast: async (castHash: string) => {
            const canWrite = await prepareWrite();
            if (canWrite) await removeCast({ castHash });
        },
        likeCast: async (castHash: string, castAuthorFid: number) => {
            const canWrite = await prepareWrite();
            if (canWrite) await likeCast({ castHash, castAuthorFid });
        },
        recastCast: async (castHash: string, castAuthorFid: number) => {
            const canWrite = await prepareWrite();
            if (canWrite) await recastCast({ castHash, castAuthorFid });
        },
        followUser: async (fid: number) => {
            const canWrite = await prepareWrite();
            if (canWrite) await followUser({ fid });
        },
        unfollowUser: async (fid: number) => {
            const canWrite = await prepareWrite();
            if (canWrite) await unfollowUser({ fid });
        }
    };
}