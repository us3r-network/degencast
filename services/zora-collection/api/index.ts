import request, { RequestPromise } from "~/services/shared/api/request";
import {
  ZoraCollectionEntity,
  ZoraCollectionType,
  ZoraTokenEntity,
} from "../types";
import { ApiResp } from "~/services/shared/types";

export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};
export function getZoraCollections({
  type,
  chainId,
  creatorAddress,
}: {
  type?: ZoraCollectionType;
  chainId?: number;
  creatorAddress?: string;
}): RequestPromise<ApiResp<Array<ZoraCollectionEntity>>> {
  return request({
    url: `/zora-collection/collections`,
    method: "get",
    headers: {
      needToken: true,
    },
    params: {
      type,
      chainId,
      creatorAddress,
    },
  });
}

export function postZoraCollection({
  chainId,
  contractAddress,
  contractMetadataURI,
  creatorAddress,
  type,
}: {
  chainId: number;
  contractAddress: string;
  contractMetadataURI: string;
  creatorAddress: string;
  type: ZoraCollectionType;
}): RequestPromise<ApiResp<ZoraCollectionEntity>> {
  return request({
    url: `/zora-collection/collections`,
    method: "post",
    data: {
      chainId,
      contractAddress,
      contractMetadataURI,
      creatorAddress,
      type,
    },
  });
}

export function postZoraToken(data: {
  chainId: number;
  tokenId: number;
  contractAddress: string;
  creatorAddress: string;
  type: ZoraCollectionType;
  tokenMetadataURI: string;
  metadataJson: string;
}): RequestPromise<ApiResp<ZoraTokenEntity>> {
  return request({
    url: `/zora-token/tokens`,
    method: "post",
    data,
  });
}
