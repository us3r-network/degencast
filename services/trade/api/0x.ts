import axios from "axios";
import { ZERO_X_API_KEY } from "~/constants";

const ZERO_X_API_ENDPOINT = "https://base.api.0x.org/swap/v1";

type SwapParams = {
  sellToken?: string;
  buyToken?: string;
  sellAmount?: string;
  buyAmount?: string;
  takerAddress?: string;
};

export async function getQuote({
  sellToken,
  buyToken,
  sellAmount,
  takerAddress,
}: SwapParams) {
  if (!Number(sellAmount)) {
    return;
  }
  try {
    const resp = await axios({
      url: `${ZERO_X_API_ENDPOINT}/quote`,
      method: "get",
      params: {
        sellToken: sellToken || "ETH",
        buyToken: buyToken || "ETH",
        sellAmount,
        takerAddress,
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
        sellToken: sellToken || "ETH",
        buyToken: buyToken || "ETH",
        sellAmount,
        buyAmount,
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
