import axios from "axios";
import { NeynarCast, NeynarChannelsResp } from "../types/neynar";

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

export async function fetchUserChannels({
  fid,
  limit,
  cursor,
}: {
  fid: number;
  limit: number;
  cursor?: string | null;
}) {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/user/channels?fid=${fid}&limit=${limit}&cursor=${cursor || ""}`,
    method: "get",
    headers: {
      api_key: NEYNAR_API_KEY,
    },
  });
  // console.log("Retrieve all channels that a given fid follows", resp.data);
  return resp.data;
}

export async function fetchUserActiveChannels({
  fid,
  limit,
  cursor,
}: {
  fid: number;
  limit: number;
  cursor?: string | null;
}): Promise<NeynarChannelsResp> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/channel/user?fid=${fid}&limit=${limit}&cursor=${cursor || ""}`,
    method: "get",
    headers: {
      api_key: NEYNAR_API_KEY,
    },
  });
  // console.log("Retrieve all channels that a given fid follows", resp.data);
  return resp.data;
}

export async function fetchUserBulk({
  fids,
  viewer_fid,
}: {
  fids: number[];
  viewer_fid: number;
}) {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/user/bulk?fids=${fids.join(",")}&viewer_fid=${viewer_fid}`,
    method: "get",
    headers: {
      api_key: NEYNAR_API_KEY,
    },
  });
  return resp.data;
  /*
  {
    "users": [
      {
        "object": "user",
        "fid": 16169,
        "custody_address": "0x007807605fc11ef51946dda148a54f21b42c8168",
        "username": "bufan",
        "display_name": "部凡",
        "pfp_url": "https://i.imgur.com/AnkNRSx.jpg",
        "profile": {
          "bio": {
            "text": "@US3R.NETWORK"
          }
        },
        "follower_count": 38,
        "following_count": 77,
        "verifications": [
          "0xa25532b1287dee6501ffa13ff457ffcc9a6ca6b0"
        ],
        "verified_addresses": {
          "eth_addresses": [
            "0xa25532b1287dee6501ffa13ff457ffcc9a6ca6b0"
          ],
          "sol_addresses": []
        },
        "active_status": "inactive",
        "power_badge": false,
        "notes": {
          "active_status": "Warpcast has transitioned from active badges to power badges, Neynar will deprecate this key in the user object in the next few weeks"
        },
        "viewer_context": {
          "following": false,
          "followed_by": false
        }
      }
    ]
  }
  */
}
