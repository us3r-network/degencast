import { OwnedToken } from "alchemy-sdk"

export type LoginRespEntity = {

};

export type MyWalletTokensRespEntity = {
    wallet: string;
    tokens: OwnedToken[];
};