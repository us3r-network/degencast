import { NeynarCast } from "~/services/farcaster/types/neynar";

export const mockCasts = [
  {
    object: "cast",
    hash: "0x3a64d0949e77321aa5b8fa6d8ce0add7872a6d48",
    thread_hash: "0x3a64d0949e77321aa5b8fa6d8ce0add7872a6d48",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/base-god",
    root_parent_url: "https://warpcast.com/~/channel/base-god",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 786682,
      custody_address: "0x1e8b07f6bce8ccb00ea9b0479c11885c89a723c3",
      username: "darlapotter",
      display_name: "Arc Warden?",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/297d51e0-1c2b-48e5-c625-dcc1c83d3000/rectcrop3",
      profile: {
        bio: {
          text: "How to become rich and healthy? Idk I'm poor and junkie...",
        },
      },
      follower_count: 24,
      following_count: 67,
      verifications: [],
      verified_addresses: {
        eth_addresses: [],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "$DEGEN allowance is claimable now.\n\nCheck your $DEGEN points and claim tokens:\n\nhttps://degen-alw.pages.dev",
    timestamp: "2024-07-17T18:42:01.000Z",
    embeds: [
      {
        url: "https://degen-alw.pages.dev",
      },
    ],
    frames: [
      {
        version: "vNext",
        image: "https://elementalhavoc.space/frame.jpg",
        image_aspect_ratio: "1:1",
        buttons: [
          {
            index: 1,
            title: "+3333 $DEGEN",
            action_type: "link",
            target:
              "https://warpcast.com/~/compose?text=$DEGEN%20allowance%20is%20claimable%20now.%0A%0ACheck%20your%20$DEGEN%20points%20and%20claim%20tokens:%0A&embeds%5B%5D=https://degen-alw.pages.dev",
          },
          {
            index: 2,
            title: "Claim",
            action_type: "link",
            target: "https://degenclaim.com/",
          },
        ],
        input: {},
        state: {},
        frames_url: "https://degen-alw.pages.dev",
      },
    ],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 0,
    },
    channel: {
      object: "channel_dehydrated",
      id: "base-god",
      name: "Base God",
      image_url: "https://i.imgur.com/f7hdfZK.jpg",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x44942a85ce53660ad09d56b5c6ded7e0143b8d7d",
    thread_hash: "0x44942a85ce53660ad09d56b5c6ded7e0143b8d7d",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/base-god",
    root_parent_url: "https://warpcast.com/~/channel/base-god",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 786682,
      custody_address: "0x1e8b07f6bce8ccb00ea9b0479c11885c89a723c3",
      username: "darlapotter",
      display_name: "Arc Warden?",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/297d51e0-1c2b-48e5-c625-dcc1c83d3000/rectcrop3",
      profile: {
        bio: {
          text: "How to become rich and healthy? Idk I'm poor and junkie...",
        },
      },
      follower_count: 24,
      following_count: 67,
      verifications: [],
      verified_addresses: {
        eth_addresses: [],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "$DEGEN allowance is claimable now.\n\nCheck your $DEGEN points and claim tokens:\n\nhttps://degen-alw.pages.dev",
    timestamp: "2024-07-17T17:49:48.000Z",
    embeds: [
      {
        url: "https://degen-alw.pages.dev",
      },
    ],
    frames: [
      {
        version: "vNext",
        image: "https://elementalhavoc.space/frame.jpg",
        image_aspect_ratio: "1:1",
        buttons: [
          {
            index: 1,
            title: "+3333 $DEGEN",
            action_type: "link",
            target:
              "https://warpcast.com/~/compose?text=$DEGEN%20allowance%20is%20claimable%20now.%0A%0ACheck%20your%20$DEGEN%20points%20and%20claim%20tokens:%0A&embeds%5B%5D=https://degen-alw.pages.dev",
          },
          {
            index: 2,
            title: "Claim",
            action_type: "link",
            target: "https://degenclaim.com/",
          },
        ],
        input: {},
        state: {},
        frames_url: "https://degen-alw.pages.dev",
      },
    ],
    reactions: {
      likes_count: 1,
      recasts_count: 1,
      likes: [
        {
          fid: 582640,
          fname: "iffimalik",
        },
      ],
      recasts: [
        {
          fid: 582640,
          fname: "iffimalik",
        },
      ],
    },
    replies: {
      count: 0,
    },
    channel: {
      object: "channel_dehydrated",
      id: "base-god",
      name: "Base God",
      image_url: "https://i.imgur.com/f7hdfZK.jpg",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
] as unknown as Array<NeynarCast>;
