import axios from "axios";
import { NeynarCast } from "../types/neynar";

const NEYNAR_API_HOST = "https://api.neynar.com";
const NEYNAR_HUB_API_HOST = "https://hub-api.neynar.com";

const NEYNAR_API_KEY = "976F5E1F-03AA-4BCC-81B2-CB80BB6F844A";

export async function fetchCastWithHash({
  hash,
}: {
  hash: string;
}): Promise<{ cast: NeynarCast }> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/cast?identifier=${hash}&type=hash`,
    method: "get",
    headers: {
      api_key: NEYNAR_API_KEY,
    },
  });

  console.log("fetchCastWithHash", resp.data);
  return resp.data;
}

export async function fetchCastWithHashFid({
  hash,
  fid,
}: {
  hash: string;
  fid: string;
}) {
  const resp = await axios({
    url: `${NEYNAR_HUB_API_HOST}/v1/castById?fid=${fid}&hash=${hash}`,
    method: "get",
    headers: {
      api_key: NEYNAR_API_KEY,
    },
  });

  console.log("fetchCastWithHashFid", resp.data);
  return resp.data;
}
