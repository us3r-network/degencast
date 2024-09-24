import {
  User,
  useConnectCoinbaseSmartWallet,
  useLinkAccount,
  usePrivy
} from "@privy-io/react-auth";
import { useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { X } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useAuth from "~/hooks/user/useAuth";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { shortPubKey } from "~/utils/shortPubKey";
import UserSignin from "../user/UserSignin";

export default function OnboardingSteps({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState<0|1|2|3>(0);

  const { user } = usePrivy();
  const { logout } = useAuth();
  const { coinBaseWallet, injectedWallet } = useWalletAccount();

  const nextStep = (newUser?: User) => {
    const u = newUser || user;
    console.log("next step", u);
    if (!u?.farcaster?.fid) {
      setStep(1);
    } else if (
      !u?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType !== "embedded",
      ) && !coinBaseWallet
    ) {
      setStep(2);
    } else if (!u?.farcaster?.signerPublicKey) {
      setStep(3);
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
                console.log("Failed to signup", error);
                onComplete();
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
        (!!injectedWallet || !!coinBaseWallet ? (
          <View className="relative h-full w-full">
            <StepImage step="2a" />
            <View className="absolute top-40 flex w-full items-center justify-center gap-2">
              <Text className="text-xl font-bold">Your active wallet is</Text>
              <Text className="text-xl font-bold">
                {injectedWallet && shortPubKey(injectedWallet.address)}
                {coinBaseWallet && shortPubKey(coinBaseWallet.address)}
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
              <View className="flex-row gap-2">
                <Button
                  variant="secondary"
                  onPress={() => connectCoinbaseSmartWallet()}
                >
                  <Text>Create</Text>
                </Button>
                {/* {isDesktop && (
                  <Button variant="secondary" onPress={() => linkWallet()}>
                    <Text>Connect</Text>
                  </Button>
                )} */}
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
      <Text>Connect</Text>
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
