import { getAccessToken } from "@privy-io/react-auth";
import { injectUserToken } from "~/services/shared/api/request";

export const injectPrivyToken = async () => {
    const token = await getAccessToken();
    console.log("injectPrivyToken", token);
    if (token) injectUserToken("Bearer "+token);
}
export const clearPrivyToken = async () => {
    injectUserToken("");
}