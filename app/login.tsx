import {
  ConnectedWallet,
  User,
  useCreateWallet,
  useLinkAccount,
  useLogin,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Dimensions, Image, SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import { getInstallPrompter } from "~/utils/pwa";
import { shortPubKey } from "~/utils/shortPubKey";

export default function LoginScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="h-full">
      <Stack.Screen
        options={{
          title: "Login",
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <View className="mx-auto h-full w-full max-w-screen-sm p-4">
        <SignUp
          onComplete={() => {
            router.back();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const { isSupported, isInstalled, showPrompt } = getInstallPrompter();
console.log("pwa stats: ", isSupported, isInstalled, showPrompt);
function SignUp({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const { user } = usePrivy();

  const { createWallet } = useCreateWallet();
  const { wallets } = useWallets();
  const embededWallet = wallets.find(
    (wallet) => wallet.connectorType === "embedded",
  );

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

  const toStep = (step: number = 0) => {
    if (!user?.farcaster?.fid && step <= 1) {
      setStep(1);
    } else if (
      !user?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType !== "embedded",
      ) &&
      step <= 2
    ) {
      setStep(2);
    } else if (!user?.farcaster?.signerPublicKey && step <= 3) {
      setStep(3);
    } else if (!isInstalled && isSupported && step <= 4) {
      setStep(4);
    } else {
      onComplete();
    }
  };

  const loginHanler = {
    onComplete: (
      user: User,
      isNewUser: boolean,
      wasAlreadyAuthenticated: boolean,
    ) => {
      console.log("login", user, isNewUser, wasAlreadyAuthenticated);
      nextStep(user);
    },
    onError: (error: unknown) => {
      console.error("Failed to login with farcaster account", error);
    },
  };
  const { login } = useLogin(loginHanler);

  const linkAccountHanler = {
    onSuccess: (user: User) => {
      console.log("Linked farcaster account", user);
      // nextStep(user);
    },
    onError: (error: unknown) => {
      console.error("Failed to link farcaster account", error);
    },
  };
  const { linkFarcaster, linkWallet } = useLinkAccount(linkAccountHanler);

  const injectedWallet = useMemo(
    () =>
      user?.linkedAccounts.find(
        (account) =>
          account.type === "wallet" && account.connectorType === "injected",
      ) as unknown as ConnectedWallet,
    [user],
  );

  const { prepareWrite } = useFarcasterWrite();

  return (
    <>
      {step === 0 && (
        <View className="relative h-full w-full">
          <Step0 />
          <Button
            variant="default"
            className="absolute bottom-0 w-full"
            onPress={() => login()}
          >
            <Text>Sign in</Text>
          </Button>
        </View>
      )}
      {step === 1 &&
        (user?.farcaster ? (
          <View className=" relative h-full w-full">
            <Step1 />
            <View className="absolute bottom-0 flex w-full items-center gap-1">
              <Text>
                Your linked farcaster account is: {user?.farcaster?.displayName}
                ({user?.farcaster?.fid})
              </Text>
              <Button
                variant="default"
                className="w-full"
                onPress={() => nextStep()}
              >
                <Text>Next</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View className=" relative h-full w-full">
            <Step1 />
            <Button
              variant="default"
              className="absolute bottom-0 w-full"
              onPress={() => linkFarcaster()}
            >
              <Text>Connect Farcaster</Text>
            </Button>
            <Button
              variant="ghost"
              className="absolute right-0 top-0"
              onPress={() => onComplete()}
            >
              <Text>Skip</Text>
            </Button>
          </View>
        ))}
      {step === 2 &&
        (!!injectedWallet ? (
          <View className="relative h-full w-full">
            <Step2 />
            <View className="absolute bottom-0 flex w-full items-center gap-1">
              <Text>
                Your active wallet is: {shortPubKey(injectedWallet.address)}
              </Text>
              <Button
                variant="default"
                className="w-full"
                onPress={() => nextStep()}
              >
                <Text>Next</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View className=" relative h-full w-full">
            <Step2 />
            <Button
              variant="default"
              className="absolute bottom-0 w-full"
              onPress={() => linkWallet()}
            >
              <Text>Connect Wallet</Text>
            </Button>
            <Button
              variant="ghost"
              className="absolute right-0 top-0"
              onPress={() => toStep(3)}
            >
              <Text>Skip</Text>
            </Button>
          </View>
        ))}
      {step === 3 &&
        (user?.farcaster?.signerPublicKey ? (
          <View className=" relative h-full w-full">
            <Step1 />
            <Text className="text-base">
              Your linked farcaster signer pubkey is:{" "}
              {shortPubKey(user?.farcaster?.signerPublicKey)}
            </Text>
            <Button
              variant="default"
              className="absolute bottom-0 w-full"
              onPress={() => nextStep()}
            >
              <Text>Next</Text>
            </Button>
          </View>
        ) : (
          <View className=" relative h-full w-full">
            <Step3 />
            <Button
              variant="default"
              className="absolute bottom-0 w-full"
              onPress={() => prepareWrite()}
            >
              <Text>Add Farcaster Signer & Earn 1000 Points</Text>
            </Button>
            <Button
              variant="ghost"
              className="absolute right-0 top-0"
              onPress={() => toStep(4)}
            >
              <Text>Skip</Text>
            </Button>
          </View>
        ))}
      {step === 4 && (
        <View className=" relative h-full w-full">
          <Step4 />
          <Button
            variant="default"
            className="absolute bottom-0 w-full"
            disabled={!isSupported}
            onPress={showPrompt}
          >
            <Text>Install Degencast</Text>
          </Button>
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onPress={() => onComplete()}
          >
            <Text>Skip</Text>
          </Button>
        </View>
      )}
    </>
  );
}

const dimensions = Dimensions.get("window");
console.log("dimensions", dimensions);
function Step0() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/1.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 2,
          resizeMode: "contain",
        }}
      />
      <Text className="text-3xl font-bold">
        Welcome to{" "}
        <Text className="text-3xl font-bold text-primary">Degencast</Text>
      </Text>
      <View className="flex gap-2">
        <Text className="text-base">√ TikTok-style Farcaster Exploration</Text>
        <Text className="text-base">√ Trade Channel shares & NFTs & Fan Tokens</Text>
        <Text className="text-base">√ Claim Channel Airdrops</Text>
        <Text className="text-base">√ Swap Channel Tokens</Text>
      </View>
      <Text className="text-base">Let’s set up in a few quick steps!</Text>
    </View>
  );
}

function Step1() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/2.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 2,
          resizeMode: "contain",
        }}
      />
      <Text className="text-3xl font-bold">
        Connect Your{" "}
        <Text className="text-3xl font-bold text-primary">Farcaster</Text> to
      </Text>
      <View className="flex gap-2">
        <Text className="text-base">√ Get your public profile</Text>
        <Text className="text-base">√ Login with Farcaster next time</Text>
      </View>
      <Text className="text-grey">
        We will not be able to post on your behalf or edit your information.
      </Text>
    </View>
  );
}

function Step2() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/2.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 2,
          resizeMode: "contain",
        }}
      />
      <Text className="text-3xl font-bold">
        Connect Your{" "}
        <Text className="text-3xl font-bold text-primary">Wallet</Text> to
      </Text>
      <View className="flex gap-2">
        <Text className="text-base">√ Trade Shares</Text>
        <Text className="text-base">√ Receive Tips</Text>
        <Text className="text-base">√ Swap Tokens</Text>
        <Text className="text-base">√ Claim Airdrop</Text>
      </View>
    </View>
  );
}

function Step3() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/3.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 2,
          resizeMode: "contain",
        }}
      />
      <Text className="text-3xl font-bold">
        Add a <Text className="text-3xl font-bold text-primary">Signer</Text> to
        Your Farcaster Account to
      </Text>
      <View className="flex-row gap-4">
        <Text className="text-base">√ Cast</Text>
        <Text className="text-base">√ Like</Text>
        <Text className="text-base">√ Tip</Text>
        <Text className="text-base">√ Share Frame</Text>
      </View>
    </View>
  );
}

function Step4() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/4.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 2.5,
          resizeMode: "contain",
        }}
      />
      <Image
        source={require("~/assets/images/signup/4b.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 3,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
