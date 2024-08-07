import axios from "axios";
import {
  DEFAULT_CHAINID,
  ZERO_X_API_ENDPOINT,
  ZERO_X_API_KEY,
  ZERO_X_INTEGRATOR_WALLET_ADDRESS,
  ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE,
} from "~/constants";


type SwapParams = {
  sellToken?: string;
  buyToken?: string;
  sellAmount?: string;
  buyAmount?: string;
  taker?: string;
  skipValidation?: boolean;
};

export async function getQuote({
  sellToken,
  buyToken,
  sellAmount,
  taker,
}: SwapParams) {
  if (!Number(sellAmount)) {
    return;
  }
  console.log("getQuote", {
    sellToken,
    buyToken,
    sellAmount,
    taker,
  });
  try {
    const resp = await axios({
      url: `${ZERO_X_API_ENDPOINT}/quote`,
      method: "get",
      params: {
        chainId: DEFAULT_CHAINID,
        sellToken: sellToken || "ETH",
        buyToken: buyToken || "ETH",
        sellAmount,
        taker,
        feeRecipient: ZERO_X_INTEGRATOR_WALLET_ADDRESS,
        buyTokenPercentageFee: ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE,
      },
      headers: {
        "0x-api-key": ZERO_X_API_KEY,
      },
    });
    return resp.data;
  } catch (error) {
    console.error("something wrong with quote api call!");
    throw new Error("something went wrong...");
  }
}

export async function getPrice({
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
}: SwapParams) {
  if (!Number(sellAmount) && !Number(buyAmount)) {
    return;
  }
  try {
    const resp = await axios({
      url: `${ZERO_X_API_ENDPOINT}/price`,
      method: "get",
      params: {
        chainId: DEFAULT_CHAINID,
        sellToken: sellToken || "ETH",
        buyToken: buyToken || "ETH",
        sellAmount,
        buyAmount,
        feeRecipient: ZERO_X_INTEGRATOR_WALLET_ADDRESS,
        buyTokenPercentageFee: ZERO_X_SWAP_TOKEN_PERCENTAGE_FEE,
      },
      headers: {
        "0x-api-key": ZERO_X_API_KEY,
      },
    });
    return resp.data;
  } catch (error) {
    console.error("something wrong with price api call!");
    // throw new Error("something went wrong...");
  }
}
