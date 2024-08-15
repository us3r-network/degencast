import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalCastCard from "../ProposalCastCard";
import { formatUnits, TransactionReceipt } from "viem";
import ProposeWriteButton from "../proposal-write-buttons/CreateProposalWriteButton";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import Toast from "react-native-toast-message";
import PriceRow from "./PriceRow";
import { getProposalMinPrice } from "../utils";
import { SceneMap, TabView } from "react-native-tab-view";
import { AboutProposalChallenge } from "./AboutProposal";
import DialogTabBar from "~/components/layout/tab-view/DialogTabBar";
import { Slider } from "~/components/ui/slider";
import { PriceRangeRow } from "./ChallengeProposalModal";
import { CreateTokenButton } from "~/components/trade/ATTButton";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import useCacheCastAttToken from "~/hooks/social-farcaster/proposal/useCacheCastAttToken";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal?: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};

const CreateProposalCtx = createContext<
  | (CastProposeStatusProps & {
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | undefined
>(undefined);
const useCreateProposalCtx = () => {
  const ctx = useContext(CreateProposalCtx);
  if (!ctx) {
    throw new Error("useCreateProposalCtx must be used within a provider");
  }
  return ctx;
};

export default function CreateProposalModal({
  cast,
  channel,
  proposal,
  tokenInfo,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "propose", title: "Propose" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    propose: CreateProposalModalContentBodyScene,
    about: AboutProposalChallenge,
  });
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <CreateProposalCtx.Provider
          value={{
            cast,
            channel,
            proposal,
            tokenInfo,
            setOpen,
          }}
        >
          <TabView
            swipeEnabled={false}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={DialogTabBar}
          />
        </CreateProposalCtx.Provider>
      </DialogContent>
    </Dialog>
  );
}

function CreateProposalModalContentBodyScene() {
  const { cast, channel, proposal, tokenInfo, setOpen } =
    useCreateProposalCtx();
  const [newTokenInfo, setNewTokenInfo] = useState<
    AttentionTokenEntity | undefined
  >(tokenInfo);
  const { upsertOneToAttTokens, getCachedAttToken } = useCacheCastAttToken();
  useEffect(() => {
    if (channel?.channelId) {
      const tokenInfoInCache = getCachedAttToken(
        channel?.channelId as `0x${string}`,
      );
      // console.log("tokenInfoInCache", tokenInfoInCache);
      if (tokenInfoInCache) {
        setNewTokenInfo(tokenInfoInCache);
      }
    }
  }, [channel.channelId]);
  return (
    <ScrollView
      className="w-full max-sm:max-h-[80vh]"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex w-full flex-col gap-4">
        {!!newTokenInfo ? (
          <CreateProposalModalContentBody
            cast={cast}
            channel={channel}
            proposal={proposal}
            tokenInfo={newTokenInfo}
            onCreateProposalSuccess={() => {
              Toast.show({
                type: "success",
                text1: "Upvote successful !",
              });
              setOpen(false);
            }}
            onCreateProposalError={(error) => {
              Toast.show({
                type: "error",
                text1: error.message,
              });
            }}
          />
        ) : (
          <CreateTokenModalContentBody
            cast={cast}
            channel={channel}
            onCreateTokenSuccess={(tokenInfo) => {
              setNewTokenInfo(tokenInfo);
              upsertOneToAttTokens(channel?.channelId!, tokenInfo);
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

function CreateTokenModalContentBody({
  cast,
  channel,
  onCreateTokenSuccess,
}: CastProposeStatusProps & {
  onCreateTokenSuccess?: (tokenInfo: AttentionTokenEntity) => void;
}) {
  return (
    <>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <ProposalCastCard channel={channel} cast={cast} />
      <Text className="text-sm text-secondary">
        This channel hasn't activated Curation Token yet. Please activate first.
      </Text>
      <CreateTokenButton
        channelId={channel?.channelId!}
        onComplete={(data) => {
          onCreateTokenSuccess?.(data);
        }}
        className="h-8"
        variant={"secondary"}
        renderButtonContent={({ loading }) => {
          return loading ? (
            <Text className="text-lg font-bold">Activating ...</Text>
          ) : (
            <Text className="text-lg font-bold">Activate</Text>
          );
        }}
      />
    </>
  );
}

function CreateProposalModalContentBody({
  cast,
  channel,
  // proposal,
  tokenInfo,
  onCreateProposalSuccess,
  onCreateProposalError,
}: CastProposeStatusProps & {
  onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
  onCreateProposalError?: (error: any) => void;
}) {
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });

  const [selectPrice, setSelectPrice] = useState<bigint | undefined>();
  const price = useMemo(
    () => getProposalMinPrice(tokenInfo, paymentTokenInfo),
    [paymentTokenInfo],
  );
  useEffect(() => {
    if (price) {
      setSelectPrice(price);
    }
  }, [price]);

  const priceSliderConfig = useMemo(() => {
    // console.log("priceSliderConfig", price, paymentTokenInfo, selectPrice);
    const priceNumber =
      price && paymentTokenInfo?.decimals
        ? Number(formatUnits(price, paymentTokenInfo?.decimals!))
        : 0;
    const selectPriceNumber =
      selectPrice && paymentTokenInfo?.decimals
        ? Number(formatUnits(selectPrice, paymentTokenInfo?.decimals!))
        : 0;
    return {
      value: paymentTokenInfo?.balance ? selectPriceNumber : 0,
      max: Number(paymentTokenInfo?.balance || 0),
      min: paymentTokenInfo?.balance
        ? tokenInfo?.bondingCurve?.basePrice || 0
        : 0,
      step: priceNumber / 100,
    };
  }, [price, paymentTokenInfo, selectPrice]);

  return (
    <>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
      <PriceRow
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={paymentTokenInfoLoading}
        onClickPriceValue={() => {
          if (price) {
            setSelectPrice(price);
          }
        }}
      />
      <Slider
        {...priceSliderConfig}
        onValueChange={(v) => {
          if (!isNaN(Number(v))) {
            const decimalsStr = "0".repeat(paymentTokenInfo?.decimals!);
            const vInt = Math.ceil(Number(v));
            setSelectPrice(BigInt(`${vInt}${decimalsStr}`));
          }
        }}
      />
      <PriceRangeRow {...priceSliderConfig} />
      <ProposeWriteButton
        cast={cast}
        channel={channel}
        // proposal={proposal}
        tokenInfo={tokenInfo}
        price={selectPrice!}
        onCreateProposalSuccess={onCreateProposalSuccess}
        onCreateProposalError={onCreateProposalError}
      />
    </>
  );
}
