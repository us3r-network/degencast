import {
  ConnectedWallet,
  User,
  useCreateWallet,
  useLinkAccount,
  useLogin,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, SafeAreaView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ApplyLaunchButton from "~/components/common/ApplyLaunchButton";
import { Chrome, Globe } from "~/components/common/Icons";
import { Loading } from "~/components/common/Loading";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import { getInstallPrompter } from "~/utils/pwa";
import { shortPubKey } from "~/utils/shortPubKey";

export const SKIP_ONBOARDING_KEY = "skipOnboarding";
export default function LoginScreen() {
  const router = useRouter();
  const [signedUp, setSignedUp] = useState(false);
  const { user } = usePrivy();

  return (
    <SafeAreaView className="h-full">
      <Stack.Screen
        options={{
          title: "Login",
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      />
      {(!signedUp && (
        <View className="mx-auto h-full w-full max-w-screen-sm p-4">
          <SignUp
            onComplete={() => {
              AsyncStorage.setItem(
                SKIP_ONBOARDING_KEY,
                new Date().toISOString(),
              );
              console.log("signed up", { fid: user?.farcaster?.fid });
              if (user?.farcaster?.fid) {
                setSignedUp(true);
              } else {
                router.back();
              }
            }}
          />
        </View>
      )) || (
        <View className="mx-auto flex h-full w-full items-center bg-primary">
          <ApplyLaunch
            onComplete={() => {
              router.back();
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const { isSupported, isInstalled, showPrompt } = getInstallPrompter();
// console.log("pwa stats: ", isSupported, isInstalled, showPrompt);
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
          <Button
            variant="ghost"
            className="absolute right-0 top-0"
            onPress={() => onComplete()}
          >
            <Text>Skip</Text>
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
            <Text className="text-base font-medium">
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
              <Text>Add Farcaster Signer & Earn 1000 $CAST</Text>
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
// console.log("dimensions", dimensions);
function Step0() {
  return (
    <View className="relative flex h-full w-full items-center justify-center gap-6 pb-10">
      <Image
        source={require("~/assets/images/signup/1.png")}
        style={{
          width: dimensions.width / 1.1,
          height: dimensions.height / 2,
          resizeMode: "contain",
        }}
      />
      <Text className="text-3xl font-bold">
        Welcome to{" "}
        <Text className="text-3xl font-bold text-primary">Degencast</Text>
      </Text>
      <View className="flex gap-2">
        <Text className="text-base font-medium">
          √ TikTok-style Farcaster Exploration
        </Text>
        <Text className="text-base font-medium">
          √ Trade Channel shares & NFTs & Fan Tokens
        </Text>
        <Text className="text-base font-medium">√ Claim Channel Airdrops</Text>
        <Text className="text-base font-medium">√ Swap Channel Tokens</Text>
      </View>
      <Text className="text-base text-primary">
        Let’s set up in a few quick steps!
      </Text>
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
        <Text className="text-base font-medium">√ Get your public profile</Text>
        <Text className="text-base font-medium">
          √ Login with Farcaster next time
        </Text>
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
        <Text className="text-base font-medium">√ Trade Shares</Text>
        <Text className="text-base font-medium">√ Receive Tips</Text>
        <Text className="text-base font-medium">√ Swap Tokens</Text>
        <Text className="text-base font-medium">√ Claim Airdrop</Text>
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
        <Text className="text-base font-medium">√ Cast</Text>
        <Text className="text-base font-medium">√ Like</Text>
        <Text className="text-base font-medium">√ Tip</Text>
        <Text className="text-base font-medium">√ Share Frame</Text>
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
          width: dimensions.width / 1.1,
          height: dimensions.height / 2.5,
          resizeMode: "contain",
        }}
      />
      {/* <Image
        source={require("~/assets/images/signup/4b.png")}
        style={{
          width: dimensions.width / 1.2,
          height: dimensions.height / 3,
          resizeMode: "contain",
        }}
      /> */}
      <View className="flex gap-4">
        <View className="flex gap-2">
          <View className="flex-row items-center gap-2">
            <Chrome className="font-bold text-secondary" />
            <Text className="text-2xl font-bold">Chrome</Text>
          </View>
          <Text className="text-base font-medium">
            Tap browser menu, and choose{"\n"}
            <Text className="font-bold text-secondary">
              Add to Home Screen
            </Text>{" "}
            option.
          </Text>
        </View>
        <View className="flex gap-2">
          <View className="flex-row items-center gap-2">
            <Globe className="font-bold text-secondary" />
            <Text className="text-2xl font-bold">Other browser</Text>
          </View>
          <Text className="text-base font-medium">
            Tap browser menu, and choose{" "}
            <Text className="font-bold text-secondary">Share</Text> option.
          </Text>
          <Text className="text-base font-medium">
            Then, choose{" "}
            <Text className="font-bold text-secondary">Add to Home Screen</Text>
            .
          </Text>
        </View>
      </View>
    </View>
  );
}

function ApplyLaunch({ onComplete }: { onComplete: () => void }) {
  const { user } = usePrivy();
  const { channels, loading, done } = useUserHostChannels(
    user?.farcaster?.fid || undefined,
  );

  useEffect(() => {
    if (done && channels.length === 0) {
      onComplete();
    }
  }, [done, channels, onComplete]);

  if (loading) {
    return <Loading />;
  }
  return (
    <View className="relative flex h-full w-full  flex-col items-center justify-center ">
      <ScrollView className="flex h-full w-full items-center ">
        <View className="max-w-screen-sm p-6">
          <View className="mb-8 flex flex-col items-center justify-center gap-8 pt-2">
            <Text className="text-3xl font-bold text-white">
              Hosting Channels
            </Text>
            <View>
              <Text className="text-center text-base font-bold text-secondary">
                Degencast is releasing Channel Share and Token Launch features
                soon.
              </Text>
              <Text className="text-center text-base font-bold text-secondary">
                Please apply in advance.
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-5">
            {channels.map((channel) => {
              return <ChannelItem key={channel.id} channel={channel} />;
            })}
          </View>
        </View>
      </ScrollView>
      <View className="flex-grow" />
      <View className="flex w-full items-center p-2">
        <Button className="h-14 w-80" onPress={() => onComplete()}>
          <Text className="text-secondary">Not now</Text>
        </Button>
      </View>
    </View>
  );
}

function ChannelItem({
  channel,
}: {
  channel: {
    id: string;
    name: string;
    imageUrl: string;
  };
}) {
  return (
    <View className="flex flex-row items-center">
      <View className="flex flex-row gap-2">
        <Image
          source={{ uri: channel.imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View className="flex flex-col justify-center">
          <Text className="text-xl text-white">{channel.name}</Text>
          <Text className="text-base text-secondary">{`/${channel.id}`}</Text>
        </View>
      </View>
      <View className="flex-grow"></View>
      <ApplyLaunchButton channelId={channel.id} />
    </View>
  );
}
