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
  danContract: "0x9549932ea7b41260ab953cc1f91de24b34a9e002",
  chain: "Base",
  bondingCurve: {
    basePrice: 10,
  },
} as unknown as AttentionTokenEntity;
