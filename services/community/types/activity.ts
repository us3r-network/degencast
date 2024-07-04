import { Author } from "~/services/farcaster/types/neynar";

export enum ActivityOperation {
  buy = "buy",
  sell = "sell",
}
export type ActivityEntity = {
  operation: ActivityOperation;
  badgeAmount: number;
  degenAmount: number;
  channel: {
    id: string;
    imageUrl: string;
  };
  userAddr: string;
  user: Author;
  timestamp: number;
};
