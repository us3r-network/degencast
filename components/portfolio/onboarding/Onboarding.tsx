import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import ApplyLaunch from "~/components/portfolio/onboarding/ApplyLaunch";
import OnboardingSteps from "~/components/portfolio/onboarding/OnboardingSteps";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import useAuth from "~/hooks/user/useAuth";

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

  return (
    <Dialog open={open} ref={ref}>
      <DialogContent hideCloseButton className="mx-auto max-w-screen-sm p-0">
        <Onboarding
          onComplete={() => {
            setOpen(false);
            const nowDate = new Date();
            AsyncStorage.setItem(SKIP_ONBOARDING_KEY, nowDate.setDate(nowDate.getDate() + 7).toString());
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
  const { user } = usePrivy();
  if (signedUp)
    return (
      <View className="mx-auto flex h-full w-full items-center bg-primary">
        <ApplyLaunch onComplete={onComplete} />
      </View>
    );
  else
    return (
      <View className="h-full w-full">
        <OnboardingSteps
          onComplete={() => {
            console.log("signed up", { fid: user?.farcaster?.fid });
            if (user?.farcaster?.fid) {
              setSignedUp(true);
            } else {
              onComplete();
            }
          }}
        />
      </View>
    );
}
