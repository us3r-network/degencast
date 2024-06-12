import axios from "axios";
import {
  ConversationCast,
  NeynarCast,
  NeynarChannelsResp,
} from "../types/neynar";
import { NEYNAR_API_HOST, FARCASTER_HUB_URL } from "~/constants/farcaster";

export async function fetchCastWithHash({
  hash,
  viewer_fid,
}: {
  hash: string;
  viewer_fid?: number;
}): Promise<{ cast: NeynarCast }> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/cast?identifier=${hash}&type=hash&viewer_fid=${viewer_fid || ""}`,
    method: "get",
  });

  console.log("fetchCastWithHash", resp.data);
  return resp.data;
}

export async function fetchCastConversationWithHash({
  hash,
  viewer_fid,
  reply_depth = 1,
}: {
  hash: string;
  viewer_fid?: number;
  reply_depth?: number;
}): Promise<{
  conversation: {
    cast: ConversationCast;
  };
}> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/cast/conversation?identifier=${hash}&type=hash&reply_depth=${reply_depth}&include_chronological_parent_casts=false&viewer_fid=${viewer_fid || ""}`,
    method: "get",
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
    url: `${FARCASTER_HUB_URL}/v1/castById?fid=${fid}&hash=${hash}`,
    method: "get",
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
