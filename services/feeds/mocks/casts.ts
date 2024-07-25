import { NeynarCast } from "~/services/farcaster/types/neynar";

export const mockCasts = [
  {
    object: "cast",
    hash: "0x3f659e5c4f5539b476e6071767e6b09167421fc1",
    thread_hash: "0x3f659e5c4f5539b476e6071767e6b09167421fc1",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- The backend adds the ability to upload metadata to arweave based on castHash, and uses redis to limit repeated uploads.\n- The front-end contract methods createProposal and disputeProposal passed the test, but the proposeProposal test failed. The reason for the failure is that getProposePrice can no longer obtain data after createProposal is called. I will ask tomorrow whether the contract is reasonable.\n- I will continue to finish the front-end tomorrow. The challenge needs to add an optional payment amount component, and some operational feedback needs to be processed.",
    timestamp: "2024-07-23T12:58:51.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x12393f80b680d49292cc326431b8b5d2736c3c29",
    thread_hash: "0x12393f80b680d49292cc326431b8b5d2736c3c29",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Start interacting with the Dan contract. Currently, the contract read operation is running normally. The cast metadata is uploaded before the contract write operation. Previously, the front end uploaded the cast image first and then uploaded the cast metadata. Now the two steps are completed in a backend interface and the test will continue tomorrow. Interface and improve contract writing operations",
    timestamp: "2024-07-22T11:28:53.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x437a3e42d24ef1fcfe2fb5574e57c53dd1d583da",
    thread_hash: "0x437a3e42d24ef1fcfe2fb5574e57c53dd1d583da",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "The latest UI layout of the home page feed list has been completed. Creating a pop-up window to initiate a proposal. After completing the UI part, the next step is to call the contract to implement the business logic of initiating the proposal.",
    timestamp: "2024-07-19T12:10:34.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/e7001f38-db36-400a-b5e4-065e0f481900/original",
      },
    ],
    reactions: {
      likes_count: 1,
      recasts_count: 1,
      likes: [
        {
          fid: 799282,
          fname: "hve",
        },
      ],
      recasts: [
        {
          fid: 799282,
          fname: "hve",
        },
      ],
    },
    replies: {
      count: 4,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xc2c1edca9b4879d5071e679ca094f6dc7f772edf",
    thread_hash: "0xc2c1edca9b4879d5071e679ca094f6dc7f772edf",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Explore adjusted its UI according to the new prototype. Instead of swiping one card at a time, swipe the card continuously. The current user experience and development experience are much better (no need to deal with some special cases of react-native-web😅)，Not finished yet, will continue tomorrow",
    timestamp: "2024-07-18T11:50:25.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 4,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xeb433cb2f6762543914b511dc44754aae754596a",
    thread_hash: "0xeb433cb2f6762543914b511dc44754aae754596a",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Today, the overall framework has been made new adjustments, including the bottom main navigation and tabs view switching in each sub-page. The sub-pages use react-native-tab-view to switch tabs. There is a bug here. When switching the main navigation The tabs of the sub-page will flash. Finally, the source code was checked and the problem was located. The onLoyout event will be triggered every time the page is left. The width and height of the page left will become 0.",
    timestamp: "2024-07-17T12:03:00.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/56e770d8-334e-4f50-adca-0757e98ed700/original",
      },
    ],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 5,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xc8a3207fd9be7b0ca4da26b10f6f7a34044962fd",
    thread_hash: "0xc8a3207fd9be7b0ca4da26b10f6f7a34044962fd",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Test and install a farcaster action https://warpcast.com/~/add-cast-action?url=https://api-dev.u3.xyz/farcaster-actions/atttoken",
    timestamp: "2024-07-17T02:36:33.000Z",
    embeds: [
      {
        url: "https://warpcast.com/~/add-cast-action?url=https://api-dev.u3.xyz/farcaster-actions/atttoken",
      },
    ],
    reactions: {
      likes_count: 1,
      recasts_count: 0,
      likes: [
        {
          fid: 531547,
          fname: "farswag",
        },
      ],
      recasts: [],
    },
    replies: {
      count: 0,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x6db1e890ee8396307cd78ebc0da93df94b3f7cef",
    thread_hash: "0x6db1e890ee8396307cd78ebc0da93df94b3f7cef",
    parent_hash: null,
    parent_url:
      "chain://eip155:7777777/erc721:0x10a77f29a6bbeae936f3f27cd60546072dae4e41",
    root_parent_url:
      "chain://eip155:7777777/erc721:0x10a77f29a6bbeae936f3f27cd60546072dae4e41",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "https://warpcast.notion.site/Spec-Farcaster-Actions-84d5a85d479a43139ea883f6823d8caa This document does not explain how to respond to open a frame pop-up window ( I guessed it during the development process {type:'frame', frameUrl: '...'} 😀 )",
    timestamp: "2024-07-17T01:31:52.000Z",
    embeds: [
      {
        url: "https://warpcast.notion.site/Spec-Farcaster-Actions-84d5a85d479a43139ea883f6823d8caa",
      },
    ],
    reactions: {
      likes_count: 3,
      recasts_count: 0,
      likes: [
        {
          fid: 7061,
          fname: "liang",
        },
        {
          fid: 492358,
          fname: "dbee",
        },
        {
          fid: 531547,
          fname: "farswag",
        },
      ],
      recasts: [],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "warpcast",
      name: "Warpcast",
      image_url:
        "https://ipfs.decentralized-content.com/ipfs/bafkreifezhnp5wzgabkdbkb6d65oix4r5axibupv45r7ifxphl4d6qqnry",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x62a63f6ffaa8dcbc087ff685ea2c7bc6999f297e",
    thread_hash: "0x62a63f6ffaa8dcbc087ff685ea2c7bc6999f297e",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- cast menu button style animation adjusted to horizontal\n- When testing the Farcaster-Actions development process, an accident occurred in one link. The cast hash returned by framesjs.validateFrameMessage() was converted into hex and could not be queried on neynar. I plan to change it to neynarClient.validateFrameAction(messageBytes) and test it again. It is also possible. It's a problem with my code. I'll ask the team members tomorrow if they have encountered this problem.",
    timestamp: "2024-07-16T12:17:29.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/4c4586a4-860f-49d8-a108-5cdea6709800/original",
      },
    ],
    reactions: {
      likes_count: 1,
      recasts_count: 0,
      likes: [
        {
          fid: 531547,
          fname: "farswag",
        },
      ],
      recasts: [],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xeb726fd428c64773e88a2e4087a2c7bdf1426964",
    thread_hash: "0xeb726fd428c64773e88a2e4087a2c7bdf1426964",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Today, with the help of @bufan, I got the degencast app running using expo-go, and also tried to install Android Studio to run the project, because I wanted to debug on the same screen, but unfortunately got stuck on the last one, I got the following Error report. This error report does not affect my development because I can still use expo-go on my mobile phone for debugging (as expected, the most troublesome thing is the development environment settings)",
    timestamp: "2024-07-15T11:42:46.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/86327827-988b-423e-f862-46e57f403d00/original",
      },
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1c847c35-578e-4119-0d1b-f0e7af0d7900/original",
      },
    ],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 4,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [
      {
        object: "user",
        fid: 16169,
        custody_address: "0x007807605fc11ef51946dda148a54f21b42c8168",
        username: "bufan",
        display_name: "部凡",
        pfp_url: "https://i.imgur.com/AnkNRSx.jpg",
        profile: {
          bio: {
            text: "@US3R.NETWORK",
            mentioned_profiles: [],
          },
        },
        follower_count: 60,
        following_count: 78,
        verifications: ["0xa25532b1287dee6501ffa13ff457ffcc9a6ca6b0"],
        verified_addresses: {
          eth_addresses: ["0xa25532b1287dee6501ffa13ff457ffcc9a6ca6b0"],
          sol_addresses: [],
        },
        active_status: "inactive",
        power_badge: false,
      },
    ],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xa20e536849399c3db9c0dfc861866dfbe8912c5a",
    thread_hash: "0xa20e536849399c3db9c0dfc861866dfbe8912c5a",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- Set tags to facilitate filtering when saving nft metadata to arweave\n- Solve some abnormal error reports in the project",
    timestamp: "2024-07-12T11:22:24.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 3,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xa175fe963d6574a42ae972ef1b2428d7e0b69d46",
    thread_hash: "0xa175fe963d6574a42ae972ef1b2428d7e0b69d46",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "The previous mint cast used nft.storage to store nft metadata. Now it has been changed to use arseeding to save to arweave. The front and back ends have been completed. If you want to use arweave's data retrieval function, the tags when saving can be further optimized.",
    timestamp: "2024-07-11T11:25:15.000Z",
    embeds: [
      {
        url: "http://nft.storage",
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
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x75f3bd3e5d32bde407e6e76b459e066c7eeed125",
    thread_hash: "0x75f3bd3e5d32bde407e6e76b459e066c7eeed125",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Research Arseeding, test uploading image data and json data to Arweave, the spliced ​​URI is written into the 1155 contract as metadataURI, and the process runs smoothly",
    timestamp: "2024-07-10T11:45:00.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 1,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xeaad56eefdda7d78fb38b8bd0f802e6f11520537",
    thread_hash: "0xeaad56eefdda7d78fb38b8bd0f802e6f11520537",
    parent_hash: null,
    parent_url: null,
    root_parent_url: null,
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Mint Untitled-4552 for free ✨\n\nhttps://far.quest/contracts/degen/untitled-4552-1",
    timestamp: "2024-07-10T06:25:34.000Z",
    embeds: [
      {
        url: "https://far.quest/contracts/degen/untitled-4552-1",
      },
    ],
    reactions: {
      likes_count: 1,
      recasts_count: 1,
      likes: [
        {
          fid: 17137,
          fname: "ttang.eth",
        },
      ],
      recasts: [
        {
          fid: 17137,
          fname: "ttang.eth",
        },
      ],
    },
    replies: {
      count: 0,
    },
    channel: null,
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xab07745deb4976c09969c8cf8ed332bb2fdeaccf",
    thread_hash: "0xab07745deb4976c09969c8cf8ed332bb2fdeaccf",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- Added detailed page about points rules\n- Display invitation codes that users can share and use",
    timestamp: "2024-07-09T10:58:25.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/cbdceac3-63e4-46e5-c971-c5075942b000/original",
      },
    ],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x5d5ff114df7af275a2a3c2e3758da8034a77addf",
    thread_hash: "0x5d5ff114df7af275a2a3c2e3758da8034a77addf",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- channel token weekly chart time and price axis style settings\n- Report points when swiping channels\n- The activities and channel onchain feed lists are changed to table format",
    timestamp: "2024-07-08T10:15:47.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 1,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0xd2b28abaa679601c9c1d3bafa865dd5a8b82eac3",
    thread_hash: "0xd2b28abaa679601c9c1d3bafa865dd5a8b82eac3",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Today, the token price weekly chart data and chart style in the channel details page have been adjusted, as well as other bugs and optimizations",
    timestamp: "2024-07-05T10:53:15.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 1,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x0930c0eaeb661d7cc2db7153748d06361b2a8f0f",
    thread_hash: "0x0930c0eaeb661d7cc2db7153748d06361b2a8f0f",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- All places where the privy login method is used are replaced with new login hooks\n- Buy channel badge button position and style adjustment (Vote for the channel to get the channel badge)",
    timestamp: "2024-07-04T11:46:29.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/95b48a11-7dfb-4fc1-85d8-35aa3b13db00/original",
      },
    ],
    reactions: {
      likes_count: 0,
      recasts_count: 1,
      likes: [],
      recasts: [
        {
          fid: 400683,
          fname: "youra",
        },
      ],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x7195afb3f54d202eff2d739d5b41abe85957e7b7",
    thread_hash: "0x7195afb3f54d202eff2d739d5b41abe85957e7b7",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Add channel badge information page（Test Data）",
    timestamp: "2024-07-03T12:45:31.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/a3127c48-4999-4421-d21e-c65fa7074700/original",
      },
    ],
    reactions: {
      likes_count: 0,
      recasts_count: 1,
      likes: [],
      recasts: [
        {
          fid: 397278,
          fname: "conking",
        },
      ],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x58162ef12548d8a34f5216ecc2706dc558f13993",
    thread_hash: "0x58162ef12548d8a34f5216ecc2706dc558f13993",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "- Encapsulate two common style components for react-native-tab-view and @react-navigation/material-top-tabs.\n- channel details page onchain feed data flow and UI implementation",
    timestamp: "2024-07-02T11:15:31.000Z",
    embeds: [],
    reactions: {
      likes_count: 0,
      recasts_count: 0,
      likes: [],
      recasts: [],
    },
    replies: {
      count: 1,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
  {
    object: "cast",
    hash: "0x7f34e2975f342b56b52b6dd497a7a748a24eebad",
    thread_hash: "0x7f34e2975f342b56b52b6dd497a7a748a24eebad",
    parent_hash: null,
    parent_url: "https://warpcast.com/~/channel/degencast",
    root_parent_url: "https://warpcast.com/~/channel/degencast",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 19087,
      custody_address: "0x1a20d4033dffe1623c453736aa3b998a21f966ad",
      username: "shixuewen",
      display_name: "Wen",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bda7ad0e-23f6-4a75-cf6c-de71fbac5700/original",
      profile: {
        bio: {
          text: "hi",
        },
      },
      follower_count: 58,
      following_count: 57,
      verifications: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
      verified_addresses: {
        eth_addresses: ["0xee87c3cddc93cb1c3af3fa84d10469fc916d5df6"],
        sol_addresses: [],
      },
      active_status: "inactive",
      power_badge: false,
      viewer_context: {
        following: false,
        followed_by: false,
      },
    },
    text: "Improve the activities page style and replace the button for switching channels on the explore page. In addition, the poems written by coderabbitai[bot] are good!",
    timestamp: "2024-07-01T10:24:24.000Z",
    embeds: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/49fecf88-2c76-4095-0d57-aac4c96fa100/original",
      },
    ],
    reactions: {
      likes_count: 1,
      recasts_count: 0,
      likes: [
        {
          fid: 394009,
          fname: "happy2vows",
        },
      ],
      recasts: [],
    },
    replies: {
      count: 2,
    },
    channel: {
      object: "channel_dehydrated",
      id: "degencast",
      name: "Degencast🎩",
      image_url: "https://i.imgur.com/qLrLl4y.png",
    },
    mentioned_profiles: [],
    viewer_context: {
      liked: false,
      recasted: false,
    },
  },
] as unknown as Array<NeynarCast>;
