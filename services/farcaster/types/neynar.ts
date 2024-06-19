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
  mentioned_profiles: Author[];
  frames?: NeynarFrame[];
  viewer_context?: {
    liked: boolean;
    recasted: boolean;
  };
};

export type NeynarFrame = {
  version: string;
  title: string;
  image: string;
  image_aspect_ratio: string;
  buttons: Array<{
    index: number;
    title?: string;
    action_type: string;
    target?: string;
    post_url?: string;
  }>;
  input: {
    text?: string;
  };
  state: {
    serialized?: string;
  };
  post_url: string;
  frames_url: string;
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
  viewer_context?: {
    followed_by: boolean;
    following: boolean;
  };
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
  likes: Array<{ fid: number; fname: string }>;
  recasts: Array<{ fid: number; fname: string }>;
}

export interface Replies {
  count: number;
}

export type NeynarChannel = {
  id: string;
  url: string;
  name: string;
  description: string;
  follower_count: number;
  image_url: string;
  object: string;
  parent_url: string;
  hosts: Author[];
  created_at: string;
};

export type PageInfo = {
  cursor: string | null;
};

export type NeynarChannelsResp = {
  channels: NeynarChannel[];
  next: PageInfo;
};

export type ConversationCast = NeynarCast & {
  direct_replies: Array<ConversationCast>;
};

export type NeynarCastsResp = {
  casts: NeynarCast[];
  next: PageInfo;
};
