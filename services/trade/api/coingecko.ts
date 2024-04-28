const TOKENS_LIST_URL = "https://tokens.coingecko.com/uniswap/all.json";
// const TOKENS_LIST_URL = "https://www.gemini.com/uniswap/manifest.json"
export const fetchTheListOfTokens = async () => {
  const response = await fetch(TOKENS_LIST_URL);
  const resp = await response.json();
  return resp.tokens;
};
