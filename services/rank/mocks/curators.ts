import { CuratorEntity } from "../types";

export const mockCurators = [
  {
    userInfo: {
      fid: 3,
      username: "dan",
      display_name: "Dan",
      pfp_url:
        "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
    },
    holdingNFTs: 10,
  },
  {
    userInfo: {
      fid: 16169,
      username: "bufan",
      display_name: "bufan",
      pfp_url: "https://i.imgur.com/AnkNRSx.jpg",
    },
    holdingNFTs: 4,
  },
] as unknown as CuratorEntity[];
