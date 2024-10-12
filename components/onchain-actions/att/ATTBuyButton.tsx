import React, { useState } from "react";
import { Pressable } from "react-native";
import { useAccount } from "wagmi";
// import About from "~/components/common/About";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { NFTProps } from "./ATTShared";
import BuyDialog from "./ATTBuyModal";

export function BuyButton({
  token,
  cast,
  renderButton,
  onSuccess,
  className,
}: NFTProps & {
  className?: string;
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
  onSuccess?: (mintNum: number) => void;
}) {
  token.symbol =
    cast?.channel?.id && cast?.channel?.id !== "home"
      ? cast?.channel?.id.toUpperCase()
      : "CAST";
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const [open, setOpen] = useState(false);
  const handlePress = () => {
    if (!account.address) {
      connectWallet();
      return;
    }
    setOpen(true);
  };
  return (
    <Pressable className={cn("w-14", className)}>
      {renderButton ? (
        renderButton({ onPress: handlePress })
      ) : (
        <Button
          className={cn("w-full")}
          size="sm"
          variant={"secondary"}
          onPress={handlePress}
        >
          <Text>Mint</Text>
        </Button>
      )}

      {account.address && (
        <BuyDialog
          token={token}
          cast={cast}
          open={open}
          onSuccess={onSuccess}
          setOpen={setOpen}
        />
      )}
    </Pressable>
  );
}
