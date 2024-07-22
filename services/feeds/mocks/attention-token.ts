import { AttentionTokenEntity } from "~/services/community/types/attention-token";

export const mockAttentionToken = {
  name: "degencast",
  logo: "https://i.imgur.com/qLrLl4y.png",
  progress: "70%",
  price: 334,
  priceTrend: "+17%",
  marketCap: 32323,
  buy24h: 23423,
  sell24h: 23423,
  holders: 2343,
  tokenStandard: "DN-404",
  tokenContract: "0x0000000000000000000000000000000000000000",
  danConstract: "0x723a19ff21a4772d5e9d4d3b2ac919bbbc92fd77",
  chain: "Base",
} as unknown as AttentionTokenEntity;
