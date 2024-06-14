import {
  MoonpayConfig,
  useConnectWallet,
  useWallets,
} from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { Button, buttonVariants } from "~/components/ui/button";
import { Plus } from "../common/Icons";
import { Text } from "~/components/ui/text";
import { cva, VariantProps } from "class-variance-authority";
import { SlottableViewProps } from "../primitives/types";
import { cn } from "~/lib/utils";

const fundButtonVariants = cva(
  "",
  {
    variants: {
      variant: {
        icon:
          "rounded-full",
        text:
          "bg-secondary",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

const fundButtonTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      icon: "",
      text: "text-secondary-foreground",
    },
  },
  defaultVariants: {
    variant: "icon",
  },
});

type FundButtonProps = SlottableViewProps &
  VariantProps<typeof fundButtonVariants>;

export default function FundButton({
  className,
  variant,
  asChild,
  ...props
}: FundButtonProps) {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const wallet = wallets.find((wallet) => wallet.address === address);
  const { connectWallet } = useConnectWallet();

  const fundWalletConfig = {
    currencyCode: "WETH", // Purchase ETH on Base mainnet
    quoteCurrencyAmount: 0.05, // Purchase 0.05 ETH
    paymentMethod: "credit_debit_card", // Purchase with credit or debit card
    uiConfig: {
      accentColor: "#696FFD",
      theme: "light",
    }, // Styling preferences for MoonPay's UIs
  };
  const buy = async () => {
    // Linking.openURL("https://buy-sandbox.moonpay.com/");
    if (!address) connectWallet();
    await wallet?.fund({
      config: fundWalletConfig as MoonpayConfig,
    });
  };

  switch (variant) {
    case "icon":
      return (
        <Button
          size="icon"
          className={cn(fundButtonVariants({ variant }),className)}
          onPress={buy}
          {...props}
        >
          <Text className={fundButtonTextVariants({ variant })}>
            <Plus />
          </Text>
        </Button>
      );
    case "text":
      return (
        <Button
          className={cn(fundButtonVariants({ variant }),className)}
          onPress={buy}
          {...props}
        >
          <Text
            className={fundButtonTextVariants({ variant })}
            {...props}
          >
            Buy with credit card
          </Text>
        </Button>
      );
  }
}
