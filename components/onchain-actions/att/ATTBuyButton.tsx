import React, {
  useState
} from "react";
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
}: NFTProps & {
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
  onSuccess?: (mintNum: number) => void;
}) {
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
    <Pressable>
      {renderButton ? (
        renderButton({ onPress: handlePress })
      ) : (
        <Button
          className={cn("w-14")}
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
