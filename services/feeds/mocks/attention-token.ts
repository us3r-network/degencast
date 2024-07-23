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
  danContract: "0x71510a95dd455565979e86fde0f309adeeefb847",
  chain: "Base",
} as unknown as AttentionTokenEntity;
