export enum ZoraCollectionType {
  CAST = "cast",
  PREMINT_CAST = "premint_cast",
}

export type ZoraCollectionEntity = {
  id: number;
  chainId: number;
  contractAddress: `0x${string}`;
  contractMetadataURI: string;
  creatorAddress: `0x${string}`;
  type: ZoraCollectionType;
  createdAt: Date;
  updateAt: Date;
};

export type ZoraTokenEntity = {
  id: number;
  chainId: number;
  tokenId: number;
  contractAddress: `0x${string}`;
  creatorAddress: `0x${string}`;
  type: ZoraCollectionType;
  tokenMetadataURI: string;
  metadataJson: string;
  createdAt: Date;
  updateAt: Date;
};
