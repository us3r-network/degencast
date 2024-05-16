import {
  Frame,
  FrameButton,
  FrameButtonLink,
  FrameButtonsType,
} from "frames.js";
import {
  FarcasterWithMetadata,
  useExperimentalFarcasterSigner,
  usePrivy,
  useLinkAccount,
  useConnectWallet,
} from "@privy-io/react-auth";

import { FarCast } from "~/services/farcaster/types";
import { View, Image, Platform, Linking, Pressable } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import Toast from "react-native-toast-message";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import { fromHex, toHex } from "viem";
import { FarcasterNetwork, Message, makeFrameAction } from "@farcaster/hub-web";
import {
  postFrameActionApi,
  postFrameActionRedirectApi,
  postFrameActionTxApi,
} from "~/services/farcaster/api/frame";
import { FARCASTER_NETWORK } from "~/constants/farcaster";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { X } from "~/components/common/Icons";
import { useAccount, useChains, useConfig } from "wagmi";
import {
  sendTransaction,
  switchChain,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { shortAddress } from "~/utils/shortAddress";

export default function EmbedFrame({
  url,
  data,
  cast,
}: {
  url: string;
  data: Frame;
  cast?: FarCast;
}) {
  const { getPrivySigner, prepareWrite } = useFarcasterWrite();

  const { user, login, ready, authenticated } = usePrivy();
  const { chain, address } = useAccount();
  const { connectWallet } = useConnectWallet();
  const config = useConfig();

  const [isLoading, setIsLoading] = useState(false);
  const [frameData, setFrameData] = useState<Frame>(data);
  const [frameRedirect, setFrameRedirect] = useState("");
  const [text, setText] = useState("");
  const [txData, setTxData] = useState<any>();
  const [txBtnIdx, setTxBtnIdx] = useState(0);
  const [txSimulate, setTxSimulate] = useState<any>([]);

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;

  const genFrameActionData = useCallback(
    async (btnIdx: number, txId?: string) => {
      if (!prepareWrite()) {
        Toast.show({
          type: "info",
          text1: "Login farcaster first",
        });
        return;
      }

      const signer = await getPrivySigner();
      if (!farcasterAccount.fid || !signer) {
        Toast.show({
          type: "info",
          text1: "Login farcaster first",
        });
        return;
      }
      if (!cast) {
        Toast.show({
          type: "info",
          text1: "No cast found",
        });
        return;
      }

      const addr = address;
      const trustedDataResult = await makeFrameAction(
        {
          url: Buffer.from(url),
          buttonIndex: btnIdx,
          inputText: Buffer.from(text),
          castId: {
            fid: Number(cast.fid),
            hash: Buffer.from(cast.hash.data),
          },
          state: Buffer.from(frameData.state || ""),
          transactionId: Buffer.from(txId || ""),
          address:
            addr && txId ? fromHex(addr as `0x`, "bytes") : Buffer.from(""),
        },
        {
          fid: Number(farcasterAccount.fid),
          network: FarcasterNetwork.MAINNET,
        },
        signer,
      );
      if (trustedDataResult.isErr()) {
        throw new Error(trustedDataResult.error.message);
      }
      const trustedDataValue = trustedDataResult.value;
      const untrustedData = {
        fid: Number(farcasterAccount.fid),
        url: url,
        messageHash: toHex(trustedDataValue.hash),
        network: FarcasterNetwork.MAINNET,
        buttonIndex: trustedDataResult.value.data.frameActionBody.buttonIndex,
        timestamp: trustedDataResult.value.data.timestamp,
        inputText: text,
        castId: {
          fid: Number(cast.fid),
          hash: toHex(cast.hash.data),
        },
        state: frameData.state || "",
        transactionId: txId || "",
        address: addr && txId ? addr : "",
      };
      const trustedData = {
        messageBytes: Buffer.from(
          Message.encode(trustedDataValue).finish(),
        ).toString("hex"),
      };
      return {
        untrustedData,
        trustedData,
      };
    },
    [frameData, farcasterAccount, cast, prepareWrite, text, address],
  );
  const reportTransaction = useCallback(
    async (txId: string, btnIdx: number, postUrl: string, state?: string) => {
      const actionData = await genFrameActionData(btnIdx, txId);
      if (!actionData) {
        return;
      }
      const { untrustedData, trustedData } = actionData;
      const postData = {
        actionUrl: postUrl,
        untrustedData,
        trustedData,
      };
      const resp = await postFrameActionApi(postData);
      if (resp.data.code !== 0) {
        return;
      }
      const { frame } = resp.data.data;
      setFrameData(frame);
    },
    [genFrameActionData],
  );
  const sendEthTransaction = useCallback(async () => {
    if (!txData) {
      return;
    }
    const chainId = txData.chainId.split(":")[1];

    try {
      const parsedChainId = parseInt(chainId, 10);
      if (chain?.id !== parsedChainId)
        await switchChain(config, { chainId: parsedChainId });

      const hash = await sendTransaction(config, {
        ...txData.params,
        chainId: parsedChainId,
      });

      const { status } = await waitForTransactionReceipt(config, {
        hash,
        chainId: parsedChainId,
      });
      console.log("tx status", status);
      if (status === "success") {
        setTxData(undefined);
        return hash;
      }
      console.error("transaction failed", hash, status);
    } catch (e: any) {
      console.error(e);
      Toast.show({
        type: "info",
        text1: "Something went wrong",
      });
    }
  }, [txData, config, chain]);

  // "link" | "post" | "post_redirect" | "mint" | "tx"
  const postFrameAction = useCallback(
    async (index: number, action: string, target?: string) => {
      setText("");
      if (action === "link") {
        setFrameRedirect(target || url);
        return;
      }
      if (action === "mint") {
        setFrameRedirect(url);
        return;
      }

      const frameActionData = await genFrameActionData(index);
      if (!frameActionData) {
        return;
      }
      const { untrustedData, trustedData } = frameActionData;

      const postData: any = {
        actionUrl: target || frameData.postUrl,
        untrustedData,
        trustedData,
      };
      if (action === "post_redirect") {
        const resp = await postFrameActionRedirectApi(postData);
        if (resp.data.code !== 0) {
          Toast.show({
            type: "info",
            text1: "Something went wrong",
          });
          return;
        }
        setFrameRedirect(resp.data.data?.redirectUrl || "");
        return;
      }
      if (action === "post") {
        const resp = await postFrameActionApi(postData);
        if (resp.data.code !== 0) {
          Toast.show({
            type: "info",
            text1: "Something went wrong",
          });
          return;
        }
        const { frame } = resp.data.data;
        setFrameData(frame);
        return;
      }

      if (action === "tx") {
        const resp = await postFrameActionTxApi(postData);
        if (resp.data.code !== 0) {
          // toast.error(resp.data.msg);
          return;
        }
        const { txData: transactionData, simulateResult } = resp.data.data;
        setTxData(transactionData);
        setTxSimulate(simulateResult);
        setTxBtnIdx(index);
        return;
      }
      if (Platform.OS === "web") {
        Toast.show({
          type: "info",
          text1: "Not supported yet",
        });
      }
    },
    [frameData, genFrameActionData, address, connectWallet],
  );

  const ratio = useMemo(() => {
    if (frameData.imageAspectRatio) {
      const w_h = frameData.imageAspectRatio.split(":");
      return Number(w_h[0]) / Number(w_h[1]);
    }
    return 16 / 8;
  }, [frameData]);

  useEffect(() => {
    setFrameData(data);
  }, [data]);

  return (
    <View className="w-full overflow-hidden rounded-[10px] border border-secondary ">
      <AspectRatio ratio={ratio} className={isLoading ? "blur-sm" : ""}>
        <Pressable
          className="h-full w-full"
          onPress={(e) => {
            e.stopPropagation();
            Linking.openURL(url);
          }}
        >
          <Image
            source={{ uri: frameData.image }}
            style={{ width: "100%", height: "100%" }}
          />
        </Pressable>
      </AspectRatio>
      <View className="p-3">
        {(frameData.inputText && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <View className="py-3">
              <Input
                className="bg-white web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0"
                placeholderClassName=" "
                placeholder={frameData.inputText}
                value={text}
                onChangeText={(v) => setText(v)}
              />
            </View>
          </Pressable>
        )) ||
          null}
        <View
          className={cn(
            "grid w-full items-center gap-3 ",
            (frameData.buttons || []).length % 2 === 0
              ? "grid-cols-2"
              : `grid-cols-${frameData.buttons?.length}`,
          )}
        >
          {(frameData.buttons || []).map((button, idx) => {
            if (!button.label) return null;
            return (
              <Button
                key={idx}
                variant={"secondary"}
                onPress={async (e) => {
                  e.stopPropagation();
                  setIsLoading(true);
                  await postFrameAction(idx + 1, button.action, button.target);
                  setIsLoading(false);
                }}
              >
                <Text>{button.label}</Text>
              </Button>
            );
          })}
        </View>
      </View>
      <RedirectAlertDialog
        url={frameRedirect}
        resetUrl={() => setFrameRedirect("")}
      />
      {address && txData && (
        <TxAlertDialog
          txData={txData}
          txSimulate={txSimulate}
          walletAddress={address}
          txAction={async () => {
            try {
              const txId = await sendEthTransaction();
              if (txId) {
                await reportTransaction(txId, txBtnIdx, frameData.postUrl);
              }
            } catch (e: any) {
              console.error(e);
            }
          }}
          close={() => {
            setTxBtnIdx(0);
            setTxData(undefined);
          }}
        />
      )}
    </View>
  );
}

function TxAlertDialog({
  txData,
  txSimulate,
  walletAddress,
  txAction,
  close,
}: {
  txData: any;
  txSimulate: any[];
  walletAddress: string;
  txAction: () => void;
  close: () => void;
}) {
  console.log(txSimulate);
  const chains = useChains();
  const from = useMemo(() => {
    return txSimulate.find(
      (item) => item.from?.toLowerCase() === walletAddress.toLowerCase(),
    );
  }, [txSimulate]);
  const to = useMemo(() => {
    return txSimulate.find(
      (item) => item.to?.toLowerCase() === walletAddress.toLowerCase(),
    );
  }, [txSimulate]);
  const chainId = txData?.chainId.split(":")[1];
  const chain = chains.find((item) => item.id === parseInt(chainId, 10));
  return (
    <AlertDialog open={!!txData}>
      <AlertDialogContent className="w-full bg-white md:w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row items-center gap-2">
            <View className="flex-grow">
              <Text className="text-lg">⚠️ Transaction</Text>
            </View>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="rounded-md bg-[#a36efe1a] web:hover:color-black web:active:color-black"
              onPress={close}
            >
              <X />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="alert-dialog-desc">
          {/* TODO: simulation */}
          <View className="p-2">
            <Text>
              chain: <Text className="text-[#718096]">{chain?.name}</Text>
            </Text>
            <Text>
              wallet address:{" "}
              <Text className="text-[#718096]">
                {shortAddress(walletAddress)}
              </Text>
            </Text>
          </View>
          <View className="mt-2 grid grid-cols-2 items-end gap-5">
            <Button
              className={cn(" flex items-center justify-center font-bold")}
              onPress={close}
            >
              <Text>Cancel</Text>
            </Button>

            <Button onPress={txAction}>
              <Text>Confirm</Text>
            </Button>
          </View>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RedirectAlertDialog({
  url,
  resetUrl,
}: {
  url: string;
  resetUrl: () => void;
}) {
  return (
    <AlertDialog open={!!url}>
      <AlertDialogContent className="w-full bg-white md:w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row items-center gap-2">
            <View className="flex-grow">
              <Text className="text-lg">⚠️ Leaving Degencast</Text>
            </View>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="rounded-md bg-[#a36efe1a] web:hover:color-black web:active:color-black"
              onPress={() => {
                resetUrl();
              }}
            >
              <X />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="alert-dialog-desc">
          <Text className="">
            You are about to leave Degencast, please connect your wallet
            carefully and take care of your funds.
          </Text>
          <View className="mt-2 grid grid-cols-3 items-end gap-5">
            <Button
              className={cn(
                "col-span-2 flex items-center justify-center font-bold",
              )}
              onPress={resetUrl}
            >
              <Text>Back to Degencast</Text>
            </Button>

            <Button
              onPress={() => {
                Linking.openURL(url);
              }}
            >
              <Text>Still leave</Text>
            </Button>
          </View>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
