import axios from "axios";

const ZERO_X_API_ENDPOINT = "https://base.api.0x.org/swap/v1";
const ZERO_X_API_KEY = "9afab301-2647-442b-84b1-2433ca2f19b0";

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
    // throw new Error("something went wrong...");
  }
}

export async function getPrice({
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
}: SwapParams) {
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
