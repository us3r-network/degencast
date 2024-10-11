
import { useCallback } from "react";
import base64url from "base64url";

import useFarcasterAccount from "./useFarcasterAccount";
import useFarcasterSigner from "./useFarcasterSigner";

export default function useWarpcastSign() {
    const { farcasterAccount, signerPublicKey } = useFarcasterAccount();
    const { requesting, getPrivySigner } = useFarcasterSigner();

    const genWarpcastSign = useCallback(async (fid: number) => {
        const privySigner = await getPrivySigner();
        if (!privySigner || !signerPublicKey) return;

        // const signer = new NobleEd25519Signer(fromHex(privateKey, 'bytes'));
        // const publicKey = toHex(await ed25519.getPublicKey(privateKey.slice(2)));
        const header = {
            fid,
            type: 'app_key',
            key: signerPublicKey,
        };
        const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));

        const payload = { exp: Math.floor(Date.now() / 1000) + 300 }; // 5 minutes
        const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));

        const signatureResult = await privySigner.signMessageHash(
            Buffer.from(`${encodedHeader}.${encodedPayload}`, 'utf-8'),
        );
        if (signatureResult.isErr()) {
            throw new Error(signatureResult.error.message);
        }
        const encodedSignature = base64url(Buffer.from(signatureResult.value));

        const authToken =
            encodedHeader + '.' + encodedPayload + '.' + encodedSignature;
        return authToken;


    }, [getPrivySigner]);

    return {
        genWarpcastSign,
    }
}