import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import ApplyLaunch from "~/components/portfolio/onboarding/ApplyLaunch";
import OnboardingSteps from "~/components/portfolio/onboarding/OnboardingSteps";
import { DepositDialog } from "~/components/trade/DepositButton";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useAuth from "~/hooks/user/useAuth";
import useWalletAccount from "~/hooks/user/useWalletAccount";

const OnboardingModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  React.ComponentPropsWithoutRef<typeof Dialog>
>(({ ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { ready, authenticated } = useAuth();
  useEffect(() => {
    const goOnboarding = async () => {
      const skipOnboardingDate =
        await AsyncStorage.getItem(SKIP_ONBOARDING_KEY);
      if (
        ready &&
        !authenticated &&
        (!skipOnboardingDate || new Date(skipOnboardingDate) < new Date())
      )
        setOpen(true);
    };
    goOnboarding();
  }, [ready, authenticated]);
  const [showDeposit, setShowDeposit] = useState(false);
  const { activeWallet, activeOneWallet, coinBaseWallet } = useWalletAccount();
  if (showDeposit) return <DepositDialog open={open} setOpen={setOpen} />;
  return (
    <Dialog open={open} ref={ref}>
      <DialogContent hideCloseButton className="mx-auto max-w-screen-sm p-0">
        <Onboarding
          onComplete={() => {
            const nowDate = new Date();
            AsyncStorage.setItem(
              SKIP_ONBOARDING_KEY,
              nowDate.setDate(nowDate.getDate() + 7).toString(),
            );
            if (
              // activeWallet?.connectorType === "embedded" ||
              activeWallet?.connectorType === "coinbase_wallet"
            )
              if (!!coinBaseWallet) {
                activeOneWallet();
                setShowDeposit(true);
              } else setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
});
export default OnboardingModal;

export const SKIP_ONBOARDING_KEY = "skipOnboarding";
export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [signedUp, setSignedUp] = useState(false);
  const { currFid } = useFarcasterAccount();
  if (signedUp)
    return (
      <View className="mx-auto flex h-full w-full items-center bg-primary">
        <ApplyLaunch onComplete={onComplete} />
      </View>
    );
  return (
    <View className="h-full w-full">
      <OnboardingSteps
        onComplete={() => {
          console.log("signed up", { fid: currFid });
          if (currFid) {
            setSignedUp(true);
          } else {
            onComplete();
          }
        }}
      />
    </View>
  );
}
