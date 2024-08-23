import { useMemo, useState } from "react";
import { Dimensions, Image, Platform, View } from "react-native";
import { X } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useAuth from "~/hooks/user/useAuth";
import {
  ConnectedWallet,
  User,
  useConnectCoinbaseSmartWallet,
  useLinkAccount,
  usePrivy,
} from "@privy-io/react-auth";
import { cn } from "~/lib/utils";
import { getInstallPrompter } from "~/utils/pwa";
import { shortPubKey } from "~/utils/shortPubKey";
import UserSignin from "../user/UserSignin";
//todo: seperate install pwa from onboarding steps
const { isSupported, isInstalled, showPrompt } = getInstallPrompter();
import { isDesktop } from "react-device-detect";

export default function OnboardingSteps({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);

  const { user } = usePrivy();
  const { logout } = useAuth();

  const nextStep = (newUser?: User) => {
    const u = newUser || user;
    if (!u?.farcaster?.fid) {
      setStep(1);
    } else if (
      !u?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType !== "embedded",
      )
    ) {
      setStep(2);
    } else if (!u?.farcaster?.signerPublicKey) {
      setStep(3);
    } else if (!isInstalled && isSupported) {
      setStep(4);
    } else {
      onComplete();
    }
  };

  const toStep = (s: number = 0) => {
    console.log("to step", s, "from", step);
    if (!user?.farcaster?.fid && s <= 1) {
      setStep(1);
    } else if (
      !user?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType !== "embedded",
      ) &&
      s <= 2
    ) {
      setStep(2);
    } else if (user?.farcaster && !user?.farcaster?.signerPublicKey && s <= 3) {
      setStep(3);
    } else if (!isInstalled && isSupported && s <= 4) {
      setStep(4);
    } else {
      onComplete();
    }
  };

  const linkAccountHanler = {
    onSuccess: (user: User, linkMethod: string) => {
      console.log("Linked account", user, linkMethod);
      // nextStep(user);
    },
    onError: (error: unknown) => {
      console.error("Failed to link farcaster account", error);
    },
  };
  const { linkFarcaster, linkWallet } = useLinkAccount(linkAccountHanler);
  const { connectCoinbaseSmartWallet } = useConnectCoinbaseSmartWallet();
  const injectedWallet = useMemo(
    () =>
      user?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType === "injected",
      ) as unknown as ConnectedWallet,
    [user],
  );
  const CloseButton = (
    <Button
      variant="default"
      className="absolute right-4 top-4 h-6 bg-transparent p-0"
      onPress={() => {
        logout();
        onComplete();
      }}
    >
      <Text>
        <X />
      </Text>
    </Button>
  );
  const SkipButton = (
    <Button
      variant="default"
      className="absolute right-4 top-4 h-6 bg-transparent p-0"
      onPress={() => toStep(step + 1)}
    >
      <Text>Skip</Text>
    </Button>
  );

  const NextButton = (
    <Button
      variant="secondary"
      className="w-1/2 rounded-full"
      onPress={() => nextStep()}
    >
      <Text>Next</Text>
    </Button>
  );

  return (
    <>
      {step === 0 && (
        <View className="relative h-full w-full">
          <StepImage step="0" />
          <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
            <StepIndicator stepNum={5} stepNo={step} />
            <UserSignin
              onSuccess={() => {
                console.log("signup successful!");
                nextStep();
              }}
              onFail={(error: unknown) => {
                console.log("Failed to login", error);
              }}
            />
          </View>
          {CloseButton}
        </View>
      )}
      {step === 1 &&
        (user?.farcaster ? (
          <View className=" relative h-full w-full">
            <StepImage step="1a" />
            <View className="absolute top-40 flex w-full items-center justify-center gap-2">
              <Text className="text-xl font-bold">
                Your linked farcaster account is
              </Text>
              <Text className="text-xl font-bold">
                {user?.farcaster?.displayName} @{user?.farcaster?.username}
              </Text>
            </View>
            <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
              <StepIndicator stepNum={5} stepNo={step} />
              {NextButton}
            </View>
          </View>
        ) : (
          <View className=" relative h-full w-full">
            <StepImage step="1" />
            <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
              <StepIndicator stepNum={5} stepNo={step} />
              <Button
                variant="secondary"
                className="w-1/2 rounded-full"
                onPress={() => linkFarcaster()}
              >
                <Text>Connect Farcaster</Text>
              </Button>
            </View>
            {SkipButton}
          </View>
        ))}
      {step === 2 &&
        (!!injectedWallet ? (
          <View className="relative h-full w-full">
            <StepImage step="2a" />
            <View className="absolute top-40 flex w-full items-center justify-center gap-2">
              <Text className="text-xl font-bold">Your active wallet is</Text>
              <Text className="text-xl font-bold">
                {shortPubKey(injectedWallet.address)}
              </Text>
            </View>
            <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
              <StepIndicator stepNum={5} stepNo={step} />
              {NextButton}
            </View>
          </View>
        ) : (
          <View className=" relative h-full w-full">
            <StepImage step="2" />
            <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
              <StepIndicator stepNum={5} stepNo={step} />
              <View>
                <Button
                  variant="secondary"
                  className="w-1/2 rounded-full"
                  onPress={() => connectCoinbaseSmartWallet()}
                >
                  <Text>Create</Text>
                </Button>
                {isDesktop && (
                  <Button
                    variant="secondary"
                    className="w-1/2 rounded-full"
                    onPress={() => linkWallet()}
                  >
                    <Text>Connect</Text>
                  </Button>
                )}
              </View>
            </View>
            {SkipButton}
          </View>
        ))}
      {step === 3 &&
        user?.farcaster &&
        (user.farcaster.signerPublicKey ? (
          <View className="relative h-full w-full">
            <StepImage step="3" />
            {/* <Text className="text-base font-medium">
              Your linked farcaster signer pubkey is:{" "}
              {shortPubKey(user?.farcaster?.signerPublicKey)}
            </Text> */}
            <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
              <StepIndicator stepNum={5} stepNo={step} />
              {NextButton}
            </View>
          </View>
        ) : (
          <View className=" relative h-full w-full">
            <StepImage step="3" />
            <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
              <StepIndicator stepNum={5} stepNo={step} />
              <RequestFarcasterSignerButton />
            </View>
            {SkipButton}
          </View>
        ))}
      {step === 4 && (
        <View className=" relative h-full w-full">
          <StepImage step="4" />
          <View className="absolute bottom-0 w-full flex-row items-center justify-between p-6">
            <StepIndicator stepNum={5} stepNo={step} />
            <Button
              variant="secondary"
              className="w-1/2 rounded-full"
              disabled={!isSupported}
              onPress={showPrompt}
            >
              <Text>Install Degencast</Text>
            </Button>
          </View>
          {SkipButton}
        </View>
      )}
    </>
  );
}

function RequestFarcasterSignerButton() {
  const { requestSigner, requesting } = useFarcasterSigner();
  return (
    <Button
      variant="secondary"
      className="w-1/2 rounded-full"
      disabled={requesting}
      onPress={() => requestSigner()}
    >
      <Text>Connect & Earn</Text>
    </Button>
  );
}

const StepIndicator = ({
  stepNum,
  stepNo,
  className,
}: {
  stepNum: number;
  stepNo: number;
  className?: string;
}) => {
  const steps = [];
  for (let i = 0; i < stepNum; i++) {
    steps.push(
      <View
        key={i}
        className={`size-2 rounded-full border-2 border-secondary ${
          i === stepNo && "bg-secondary"
        }`}
      />,
    );
  }
  return <View className={cn("flex-row gap-4", className)}>{steps}</View>;
};

const STEP_IMAGES = {
  "0": require("assets/images/onboarding/0.png"),
  "1": require("assets/images/onboarding/1.png"),
  "2": require("assets/images/onboarding/2.png"),
  "1a": require("assets/images/onboarding/1a.png"),
  "2a": require("assets/images/onboarding/2a.png"),
  "3": require("assets/images/onboarding/3.png"),
  "4": require("assets/images/onboarding/4.png"),
};
const dimensions = Dimensions.get("window");
const imageWidth = Math.min(dimensions.width, 400);
function StepImage({ step, className }: { step: string; className?: string }) {
  return (
    <View className={cn("relative h-full w-full pb-20", className)}>
      <Image
        source={STEP_IMAGES[step as keyof typeof STEP_IMAGES]}
        style={{
          width: imageWidth,
          height: imageWidth * 1.5,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
