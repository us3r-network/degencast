import { OwnedToken } from "alchemy-sdk"

export type LoginRespEntity = {
    id: number;
};

export type MyWalletTokensRespEntity = {
    wallet: string;
    tokens: OwnedToken[];
};