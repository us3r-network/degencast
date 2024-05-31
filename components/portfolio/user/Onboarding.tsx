import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ApplyLaunch from "~/components/portfolio/user/ApplyLaunch";
import SignUp from "~/components/portfolio/user/Signup";
import { Dialog, DialogContent } from "~/components/ui/dialog";

const OnboardingModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  React.ComponentPropsWithoutRef<typeof Dialog>
>(({ ...props }, ref) => {
  const [open, setOpen] = useState(true);
  const { ready, authenticated: privyAuthenticated } = usePrivy();
  useEffect(() => {
    const goOnboarding = async () => {
      const skipOnboardingDate =
        await AsyncStorage.getItem(SKIP_ONBOARDING_KEY);
      if (
        ready &&
        !privyAuthenticated &&
        (!skipOnboardingDate || new Date(skipOnboardingDate) < new Date())
      )
        setOpen(true);
    };
    goOnboarding();
  }, [ready, privyAuthenticated]);

  return (
    <Dialog open={open} ref={ref}>
      <DialogContent hideCloseButton className="mx-auto max-w-screen-sm p-0">
        <Onboarding onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
});
export default OnboardingModal;

export const SKIP_ONBOARDING_KEY = "skipOnboarding";
export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
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
        <SignUp
          onComplete={() => {
            AsyncStorage.setItem(SKIP_ONBOARDING_KEY, new Date().toISOString());
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
