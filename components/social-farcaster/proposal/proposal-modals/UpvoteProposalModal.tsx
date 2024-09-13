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
import { parseUnits, TransactionReceipt } from "viem";
import Toast from "react-native-toast-message";
import { ProposeProposalWriteButton } from "../proposal-write-buttons/ProposalWriteButton";
import useAppModals from "~/hooks/useAppModals";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { PaymentInfoType, ProposalPaymentSelector } from "./PaymentSelector";
import { Loading } from "~/components/common/Loading";

export type CastProposeStatusProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  tokenInfo?: AttentionTokenEntity;
  proposal?: ProposalEntity;
};

export default function UpvoteProposalModal({
  cast,
  channel,
  tokenInfo,
  proposal,
  triggerButton,
}: CastProposeStatusProps & {
  triggerButton: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { upsertProposalShareModal } = useAppModals();
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
            proposal={proposal}
            onProposeSuccess={() => {
              Toast.show({
                type: "success",
                text1: "Voting speeds up success",
              });
              setOpen(false);
              upsertProposalShareModal({ open: true, cast, channel, proposal });
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
  proposal,
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

  const [selectedPaymentToken, setSelectedPaymentToken] =
    useState(paymentTokenInfo);

  const [selectedPayAmount, setSelectedPayAmount] = useState(0n);

  useEffect(() => {
    if (!isLoading && price) {
      setSelectedPayAmount(price);
    }
  }, [price, isLoading]);
  const minPayAmountNumber = tokenInfo?.bondingCurve?.basePrice || 0;
  const minAmount = parseUnits(
    minPayAmountNumber.toString(),
    paymentTokenInfo?.decimals!,
  );
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

      {paymentTokenInfoLoading ? (
        <Loading />
      ) : selectedPaymentToken ? (
        <ProposalPaymentSelector
          // title="Upvote Cost"
          paymentInfoType={PaymentInfoType.Upvote}
          defaultPaymentInfo={{
            tokenInfo: paymentTokenInfo!,
            recommendedAmount: price,
            minAmount: minAmount,
          }}
          selectedPaymentToken={selectedPaymentToken!}
          setSelectedPaymentToken={setSelectedPaymentToken}
          selectedPayAmount={selectedPayAmount!}
          setSelectedPayAmount={setSelectedPayAmount}
        />
      ) : null}
      <ProposeProposalWriteButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        paymentTokenInfo={paymentTokenInfo!}
        usedPaymentTokenInfo={selectedPaymentToken}
        paymentTokenInfoLoading={paymentTokenInfoLoading}
        paymentAmount={selectedPayAmount!}
        onProposeSuccess={onProposeSuccess}
        onProposeError={onProposeError}
      />
    </>
  );
}
