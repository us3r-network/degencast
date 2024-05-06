export type NeynarCast = {
  object: "cast";
  hash: string;
  thread_hash: string;
  parent_hash: any;
  parent_url: any;
  root_parent_url: any;
  parent_author: {
    fid: any;
  };
  author: Author;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: Reactions;
  replies: Replies;
  mentioned_profiles: any[];
};

export type Author = {
  object: "user";
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: string;
  power_badge: boolean;
};

export interface Profile {
  bio: Bio;
}

export interface Bio {
  text: string;
  mentioned_profiles: any[];
}

export interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface Reactions {
  likes_count: number;
  recasts_count: number;
  likes: any[];
  recasts: any[];
}

export interface Replies {
  count: number;
}
