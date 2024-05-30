import { Image } from "react-native";
import {
    Wallet
} from "~/components/common/Icons";

export function WalletIcon({ type }: { type: string | undefined }) {
  switch (type) {
    case "privy":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/privy-icon.webp")}
          className="rounded-md"
        />
      );
    case "metamask":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/metamask-icon.svg")}
        />
      );
    default:
      return <Wallet className="size-4" />;
  }
}
