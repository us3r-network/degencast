/** Type of UserData */
export enum UserDataType {
  NONE = 0,
  /** PFP - Profile Picture for the user */
  PFP = 1,
  /** DISPLAY - Display Name for the user */
  DISPLAY = 2,
  /** BIO - Bio for the user */
  BIO = 3,
  /** URL - URL of the user */
  URL = 5,
  /** USERNAME - Preferred Name for the user */
  USERNAME = 6,
}

/** Farcaster network the message is intended for */
export enum FarcasterNetwork {
  NONE = 0,
  /** MAINNET - Public primary network */
  MAINNET = 1,
  /** TESTNET - Public test network */
  TESTNET = 2,
  /** DEVNET - Private test network */
  DEVNET = 3,
}

/** Identifier used to look up a Cast */
export interface CastId {
  /** Fid of the user who created the cast */
  fid: number;
  /** Hash of the cast */
  hash: Uint8Array;
}
