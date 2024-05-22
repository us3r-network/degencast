import request, { RequestPromise } from "~/services/shared/api/request";
import { ZoraCollectionEntity, ZoraCollectionType } from "../types";
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
  creatorAddress,
  type,
}: {
  chainId: number;
  contractAddress: string;
  creatorAddress: string;
  type: ZoraCollectionType;
}): RequestPromise<ApiResp<ZoraCollectionEntity>> {
  return request({
    url: `/zora-collection/collections`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: {
      chainId,
      contractAddress,
      creatorAddress,
      type,
    },
  });
}
