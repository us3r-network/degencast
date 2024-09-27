import { useAccount } from "wagmi";
import { Button, buttonVariants } from "~/components/ui/button";
import { Plus } from "~/components/common/Icons";
import { Text } from "~/components/ui/text";
import { cva, VariantProps } from "class-variance-authority";
import { SlottableViewProps } from "@rn-primitives/types";
import { cn } from "~/lib/utils";
import useWalletAccount, { MoonpayConfig } from "~/hooks/user/useWalletAccount";
import { DEFAULT_CHAIN, DEGEN_TOKEN_ADDRESS, PRIMARY_COLOR } from "~/constants";
import { useFundWallet } from "@privy-io/react-auth";

const fundButtonVariants = cva("", {
  variants: {
    variant: {
      icon: "rounded-full",
      text: "",
    },
  },
  defaultVariants: {
    variant: "icon",
  },
});

const fundButtonTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      icon: "",
      text: "text-sm native:text-base",
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
  const { getActualUseWalletAddress } = useWalletAccount();
  const { fundWallet } = useFundWallet();

  const buy = async () => {
    // Linking.openURL("https://buy-sandbox.moonpay.com/");
    const walletAddress = getActualUseWalletAddress();
    await fundWallet(walletAddress, {
      chain: DEFAULT_CHAIN,
      asset: { erc20: DEGEN_TOKEN_ADDRESS },
      amount: "10000",
    });
  };

  switch (variant) {
    case "icon":
      return (
        <Button
          size="icon"
          className={cn(fundButtonVariants({ variant }), className)}
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
          variant="secondary"
          className={cn(fundButtonVariants({ variant }), className)}
          onPress={buy}
          {...props}
        >
          <Text className={fundButtonTextVariants({ variant })} {...props}>
            Buy with credit card
          </Text>
        </Button>
      );
  }
}
