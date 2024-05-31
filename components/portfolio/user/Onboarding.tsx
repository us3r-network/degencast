import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import ApplyLaunch from "~/components/portfolio/user/ApplyLaunch";
import SignUp from "~/components/portfolio/user/Signup";
import { Dialog, DialogContent } from "~/components/ui/dialog";

export default function OnboardingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <Onboarding />
      </DialogContent>
    </Dialog>
  );
}

export const SKIP_ONBOARDING_KEY = "skipOnboarding";
export function Onboarding() {
  const router = useRouter();
  const [signedUp, setSignedUp] = useState(false);
  const { user } = usePrivy();
  if (signedUp)
    return (
      <View className="mx-auto flex h-full w-full items-center bg-primary">
        <ApplyLaunch
          onComplete={() => {
            router.back();
          }}
        />
      </View>
    );
  else
    return (
      <View className="mx-auto h-full w-full max-w-screen-sm p-4">
        <SignUp
          onComplete={() => {
            AsyncStorage.setItem(SKIP_ONBOARDING_KEY, new Date().toISOString());
            console.log("signed up", { fid: user?.farcaster?.fid });
            if (user?.farcaster?.fid) {
              setSignedUp(true);
            } else {
              router.back();
            }
          }}
        />
      </View>
    );
}
