export enum ZoraCollectionType {
  CAST = "cast",
}

export type ZoraCollectionEntity = {
  id: number;
  chainId: number;
  contractAddress: `0x${string}`;
  creatorAddress: `0x${string}`;
  type: ZoraCollectionType;
  createdAt: Date;
  updateAt: Date;
};
