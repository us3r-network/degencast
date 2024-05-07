import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ChevronLeft } from "~/components/common/Icons";
import { Image } from "expo-image";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { Button, ButtonProps } from "~/components/ui/button";
import {
  usePrivy,
  useCreateWallet,
  useWallets,
  useLinkAccount,
  useLogin,
  User,
  CallbackError,
  useConnectWallet,
  ConnectedWallet,
} from "@privy-io/react-auth";
import { on } from "events";
import { shortPubKey } from "~/utils/shortPubKey";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import isInstalledPwa from "~/utils/pwa";
import InstallPWAButton from "~/components/common/InstallPwaButton";

export default function LoginScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="h-full">
      <Stack.Screen
        options={{
          title: "Login",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "white" },
          headerLeft: () => {
            return (
              <View className="w-fit p-3 ">
                <Button
                  className="rounded-full bg-[#a36efe1a]"
                  size={"icon"}
                  variant={"ghost"}
                  onPress={() => {
                    router.back();
                  }}
                >
                  <ChevronLeft />
                </Button>
              </View>
            );
          },
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
          account.type === "wallet" && account.connectorType === "injected",
      )
    ) {
      setStep(2);
    } else if (!u?.farcaster?.signerPublicKey) {
      setStep(3);
    } else if (!isInstalledPwa) {
      setStep(4);
    } else {
      setStep(4);
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

  // const connectWalletHanler = {
  //   onSuccess: (wallet: unknown) => {
  //     console.log("connect wallet", wallet);
  //     nextStep();
  //   },
  //   onError: (error: unknown) => {
  //     console.error("Failed to link farcaster account", error);
  //   },
  // };
  // const { connectWallet } = useConnectWallet(connectWalletHanler);

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
              onPress={() => setStep(4)}
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
              onPress={() => setStep(3)}
            >
              <Text>Skip</Text>
            </Button>
          </View>
        ))}
      {step === 3 &&
        (user?.farcaster?.signerPublicKey ? (
          <View className=" relative h-full w-full">
            <Step1 />
            <Text className="text-lg">
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
              onPress={() => setStep(4)}
            >
              <Text>Skip</Text>
            </Button>
          </View>
        ))}
      {step === 4 && (
        <View className=" relative h-full w-full">
          <Step4 />
          <InstallPWAButton
            variant="default"
            className="absolute bottom-0 w-full"
          >
            <Text>Install Degencast</Text>
          </InstallPWAButton>
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

function Step0() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/1.png")}
        contentFit="contain"
        style={{ width: 400, height: 400 }}
      />
      <Text className="text-3xl font-bold">
        Welcome to{" "}
        <Text className="text-3xl font-bold text-primary">Degencast</Text>
      </Text>
      <Text className="text-lg">Let’s set up in a few quick steps!</Text>
    </View>
  );
}

function Step1() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/2.png")}
        contentFit="contain"
        style={{ width: 400, height: 340 }}
      />
      <Text className="text-3xl font-bold">
        Connect Your{" "}
        <Text className="text-3xl font-bold text-primary">Farcaster</Text> to
      </Text>
      <View className="flex gap-2">
        <Text className="text-lg">√ Get your public profile</Text>
        <Text className="text-lg">√ Login with Farcaster next time</Text>
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
        contentFit="contain"
        style={{ width: 400, height: 340 }}
      />
      <Text className="text-3xl font-bold">
        Connect Your{" "}
        <Text className="text-3xl font-bold text-primary">Wallet</Text> to
      </Text>
      <View className="flex gap-2">
        <Text className="text-lg">√ Trade Shares</Text>
        <Text className="text-lg">√ Receive Tips</Text>
        <Text className="text-lg">√ Swap Tokens</Text>
        <Text className="text-lg">√ Claim Airdrop</Text>
      </View>
    </View>
  );
}

function Step3() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/3.png")}
        contentFit="contain"
        style={{ width: 400, height: 360 }}
      />
      <Text className="text-3xl font-bold">
        Add a{" "}
        <Text className="text-3xl font-bold text-primary">Signer</Text> to Your
        Farcaster Account to
      </Text>
      <View className="flex-row gap-4">
        <Text className="text-lg">√ Cast</Text>
        <Text className="text-lg">√ Like</Text>
        <Text className="text-lg">√ Tip</Text>
        <Text className="text-lg">√ Share Frame</Text>
      </View>
    </View>
  );
}

function Step4() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/4.png")}
        contentFit="contain"
        style={{ width: 360, height: 320 }}
      />
      <Image
        source={require("~/assets/images/signup/4b.png")}
        contentFit="contain"
        style={{ width: 320, height: 240 }}
      />
    </View>
  );
}