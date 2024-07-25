import request, { RequestPromise } from "./shared/api/request";
import { ApiResp } from "./shared/types";

export type UploadImageResult = {
  url: string;
};
export function uploadImage(
  formData: FormData,
  token?: string,
): RequestPromise<UploadImageResult> {
  //   const form = new FormData();
  //   form.append("file", file);
  return request({
    url: "/medium/upload",
    method: "post",
    data: formData,
    headers: {
      needToken: true,
      token,
    },
  });
}

export type ARUploadResult = {
  arUrl: string;
  arseedUrl: string;
  everHash: string;
  order: {
    itemId: string;
    size: number;
    bundler: string;
    currency: string;
    decimals: number;
    fee: string;
    paymentExpiredTime: number;
    expectedBlock: number;
    tag: string;
  };
};

export function arUploadCastImage(
  castHash: string,
  tags?: Array<{ name: string; value: any }>,
): RequestPromise<ApiResp<ARUploadResult>> {
  return request({
    url: "/arweave/upload/cast-image",
    method: "post",
    data: {
      castHash,
      ...(tags ? { tags } : {}),
    },
    headers: {
      needToken: true,
    },
  });
}

export function arUploadMetadata(
  data: any,
  tags?: Array<{ name: string; value: string }>,
): RequestPromise<ApiResp<ARUploadResult>> {
  return request({
    url: "/arweave/upload/metadata",
    method: "post",
    data: {
      data,
      ...(tags ? { tags } : {}),
    },
    headers: {
      needToken: true,
    },
  });
}

export function arCheckCastProposalMetadata(
  castHash: string,
): RequestPromise<ApiResp<ARUploadResult>> {
  return request({
    url: `/arweave/check-cast-proposal-metadata/${castHash}`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}
