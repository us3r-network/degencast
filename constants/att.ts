import { Address } from "viem";
import { baseSepolia } from "viem/chains";
import { TokenWithTradeInfo } from "~/services/trade/types";

export const ATT_FACTORY_CONTRACT_ADDRESS: Address =
  "0xE5E3da329D361C3ebf21E849bCf1B3e78730Dc33";
export const ATT_CONTRACT_CHAIN = baseSepolia;

//todo: delete this later
// export const BADGE_PAYMENT_TOKEN: TokenWithTradeInfo = {
//   chainId: baseSepolia.id,
//   address: "0xD084FD38BB7fDba38b0a2BffbA9e558ce29Ad8AC",
//   name: "DEGEN",
//   decimals: 18,
//   symbol: "DEGEN",
//   logoURI:
//     "https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png",
// };
//todo: delete this later
// export const BADGE_TEST_TOKEN_ADDRESS: Address =
//   "0x92aAefcE127B885e1d73E2eb0001641386693DA6";
