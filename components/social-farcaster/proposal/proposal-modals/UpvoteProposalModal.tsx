import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import ProposalCastCard from "../ProposalCastCard";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import PriceRow from "./PriceRow";
import { formatUnits, TransactionReceipt } from "viem";
import Toast from "react-native-toast-message";
import { ProposeProposalWriteButton } from "../proposal-write-buttons/ProposalWriteButton";
import { Slider } from "~/components/ui/slider";
import { PriceRangeRow } from "./ChallengeProposalModal";
import useAppModals from "~/hooks/useAppModals";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
};

export default function UpvoteProposalModal({
  cast,
  channel,
  tokenInfo,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { upsetProposalShareModal } = useAppModals();
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
        <ScrollView
          className="max-h-[80vh] w-full"
          showsHorizontalScrollIndicator={false}
        >
          <UpvoteProposalModalContentBody
            cast={cast}
            channel={channel}
            tokenInfo={tokenInfo}
            onProposeSuccess={() => {
              Toast.show({
                type: "success",
                text1: "Voting speeds up success",
              });
              setOpen(false);
              upsetProposalShareModal({ open: true, cast, channel });
            }}
            onProposeError={(error) => {
              Toast.show({
                type: "error",
                text1: error.message,
              });
              setOpen(false);
            }}
          />
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}

export function UpvoteProposalModalContentBody({
  cast,
  channel,
  tokenInfo,
  onProposeSuccess,
  onProposeError,
}: CastProposeStatusProps & {
  onProposeSuccess?: (proposal: TransactionReceipt) => void;
  onProposeError?: (error: any) => void;
}) {
  const {
    paymentTokenInfo,
    isLoading: paymentTokenInfoLoading,
    error: paymentTokenInfoError,
  } = usePaymentTokenInfo({
    contractAddress: tokenInfo?.danContract!,
  });
  const {
    price,
    isLoading,
    error: priceError,
  } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });

  const [selectPrice, setSelectPrice] = useState<bigint | undefined>(undefined);
  useEffect(() => {
    if (!isLoading && price) {
      console.log("price", price);
      setSelectPrice(price);
    }
  }, [price, isLoading]);

  const priceNumber =
    price && paymentTokenInfo?.decimals
      ? Number(formatUnits(price, paymentTokenInfo?.decimals!))
      : 0;
  const selectPriceNumber =
    selectPrice && paymentTokenInfo?.decimals
      ? Number(formatUnits(selectPrice, paymentTokenInfo?.decimals!))
      : 0;
  const priceSliderConfig = {
    value: paymentTokenInfo?.balance ? selectPriceNumber : 0,
    max: Number(paymentTokenInfo?.balance || 0),
    min: paymentTokenInfo?.balance
      ? tokenInfo?.bondingCurve?.basePrice || 0
      : 0,
    step: priceNumber / 100,
  };
  return (
    <>
      {/* <DialogHeader
        className={cn("mr-4 flex-row items-center justify-between gap-2")}
      >
        <DialogTitle>Upvote</DialogTitle>
      </DialogHeader> */}
      <View className="flex-row items-center justify-between gap-2">
        <Text>Active Wallet</Text>
        <UserWalletSelect />
      </View>
      <ProposalCastCard channel={channel} cast={cast} tokenInfo={tokenInfo} />
      <PriceRow
        title="Upvote Cost"
        paymentTokenInfo={paymentTokenInfo}
        price={price}
        isLoading={isLoading || paymentTokenInfoLoading}
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
      <Text className="text-center text-xs text-secondary">
        Stake DEGEN, get funds back and earn minting fee rewards upon success!
      </Text>
      <ProposeProposalWriteButton
        cast={cast}
        channel={channel}
        tokenInfo={tokenInfo}
        price={price!}
        onProposeSuccess={onProposeSuccess}
        onProposeError={onProposeError}
      />
    </>
  );
}
