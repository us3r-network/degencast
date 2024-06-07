import { Image } from "react-native";
import { Wallet } from "~/components/common/Icons";

export function WalletIcon({ type }: { type: string | undefined }) {
  switch (type) {
    case "privy":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/wallet-icon/privy.webp")}
          className="rounded-md"
        />
      );
    case "metamask":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/wallet-icon/metamask.svg")}
        />
      );
    case "coinbase_wallet":
    case "coinbase_smart_wallet":
      return (
        <Image
          style={{ width: 16, height: 16 }}
          source={require("~/assets/images/wallet-icon/coinbase.png")}
        />
      );
    default:
      return <Wallet className="size-4" />;
  }
}
