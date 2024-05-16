import {
  MoonpayConfig,
  useConnectWallet,
  useWallets,
} from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import { Plus } from "../common/Icons";
import { Text } from "~/components/ui/text";

export default function FundButton() {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const wallet = wallets.find((wallet) => wallet.address === address);
  const fundWalletConfig = {
    currencyCode: "WETH", // Purchase ETH on Base mainnet
    quoteCurrencyAmount: 0.05, // Purchase 0.05 ETH
    paymentMethod: "credit_debit_card", // Purchase with credit or debit card
    uiConfig: {
      accentColor: "#696FFD",
      theme: "light",
    }, // Styling preferences for MoonPay's UIs
  };
  const account = useAccount();
  const { connectWallet } = useConnectWallet();

  const buy = async () => {
    // Linking.openURL("https://buy-sandbox.moonpay.com/");
    if (!address) connectWallet();
    await wallet?.fund({
      config: fundWalletConfig as MoonpayConfig,
    });
  };
  return (
    <Button size={"icon"} className="rounded-full" onPress={buy}>
      <Text>
        <Plus />
      </Text>
    </Button>
  );
}
