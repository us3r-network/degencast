import { View } from "react-native";
import PriceRow from "./PriceRow";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";
import { PriceRangeRow } from "./ChallengeProposalModal";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { formatUnits, parseUnits } from "viem";
import UserTokenSelect from "~/components/onchain-actions/common/UserTokenSelect";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { useSwap } from "~/hooks/trade/useUniSwapV3";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useAccount } from "wagmi";
import { useUserNativeToken } from "~/hooks/user/useUserTokens";
import {
  NATIVE_TOKEN_ADDRESS,
  UNISWAP_V3_DEGEN_ETH_POOL_FEES,
} from "~/constants/chain";
import { useEffect, useState } from "react";

export enum PaymentInfoType {
  Create,
  Proposed,
  Upvote,
  Challenge,
}
export function ProposalPaymentSelector({
  defaultPaymentInfo,
  selectedPaymentToken,
  setSelectedPaymentToken,
  selectedPayAmount,
  setSelectedPayAmount,
  paymentInfoType,
}: {
  defaultPaymentInfo: {
    tokenInfo?: TokenWithTradeInfo;
    tokenInfoLoading?: boolean;
    recommendedAmount?: bigint;
    recommendedAmountLoading?: boolean;
    minAmount?: bigint;
  };
  selectedPaymentToken: TokenWithTradeInfo;
  setSelectedPaymentToken: (token: TokenWithTradeInfo) => void;
  selectedPayAmount: bigint;
  setSelectedPayAmount: (amount: bigint) => void;
  paymentInfoType: PaymentInfoType;
}) {
  const { supportAtomicBatch } = useWalletAccount();
  const account = useAccount();

  const {
    tokenInfo: defaultTokenInfo,
    recommendedAmount: defaultRecommendedAmount,
    recommendedAmountLoading: defaultRecommendedAmountLoading,
    minAmount: defaultMinAmount,
  } = defaultPaymentInfo;

  const { token: ethTokenInfo } = useUserNativeToken(
    account.address,
    defaultTokenInfo?.chainId,
  );

  const [fetchedEthRecommendedAmount, setFetchedEthRecommendedAmount] =
    useState<bigint>();
  const [fetchedEthMinAmount, setFetchedEthMinAmount] = useState<bigint>();

  const isSelectedEthToken =
    selectedPaymentToken?.address === ethTokenInfo?.address;
  const recommendedPayAmount = isSelectedEthToken
    ? fetchedEthRecommendedAmount
    : defaultRecommendedAmount;

  const minPayAmount = isSelectedEthToken
    ? fetchedEthMinAmount
    : defaultMinAmount;

  return (
    <View className="flex flex-col gap-4">
      {!!ethTokenInfo &&
        defaultTokenInfo &&
        supportAtomicBatch(defaultTokenInfo.chainId) && (
          <UserTokenSelectWrapper
            ethTokenInfo={ethTokenInfo}
            defaultTokenInfo={defaultTokenInfo}
            selectedPaymentToken={selectedPaymentToken}
            setSelectedPaymentToken={setSelectedPaymentToken}
            defaultRecommendedAmount={defaultRecommendedAmount}
            defaultMinAmount={defaultMinAmount}
            selectedPayAmount={selectedPayAmount}
            setSelectedPayAmount={setSelectedPayAmount}
            setFetchedEthRecommendedAmount={setFetchedEthRecommendedAmount}
            setFetchedEthMinAmount={setFetchedEthMinAmount}
          />
        )}

      {paymentInfoType === PaymentInfoType.Create ? (
        <PaymentInfo
          paymentTokenInfo={selectedPaymentToken}
          recommendedPayAmount={recommendedPayAmount || 0n}
          minPayAmount={minPayAmount || 0n}
          selectedPayAmount={selectedPayAmount}
          setSelectedPayAmount={setSelectedPayAmount}
          hideChallengeAmount={true}
        />
      ) : paymentInfoType === PaymentInfoType.Proposed ? (
        <PaymentInfoWithProposed
          paymentTokenInfo={selectedPaymentToken}
          recommendedPayAmount={recommendedPayAmount || 0n}
          minPayAmount={minPayAmount || 0n}
          selectedPayAmount={selectedPayAmount}
          setSelectedPayAmount={setSelectedPayAmount}
        />
      ) : paymentInfoType === PaymentInfoType.Upvote ? (
        <PaymentInfo
          paymentTokenInfo={selectedPaymentToken}
          recommendedPayAmount={recommendedPayAmount || 0n}
          minPayAmount={minPayAmount || 0n}
          selectedPayAmount={selectedPayAmount}
          setSelectedPayAmount={setSelectedPayAmount}
          description="Upvote spam casts, share the staked funds after success."
        />
      ) : paymentInfoType === PaymentInfoType.Challenge ? (
        <PaymentInfo
          paymentTokenInfo={selectedPaymentToken}
          recommendedPayAmount={recommendedPayAmount || 0n}
          minPayAmount={minPayAmount || 0n}
          selectedPayAmount={selectedPayAmount}
          setSelectedPayAmount={setSelectedPayAmount}
          description="Downvote spam casts, share the staked funds after success."
        />
      ) : null}
    </View>
  );
}

function UserTokenSelectWrapper({
  ethTokenInfo,
  defaultTokenInfo,
  selectedPaymentToken,
  setSelectedPaymentToken,
  defaultRecommendedAmount,
  defaultMinAmount,
  selectedPayAmount,
  setSelectedPayAmount,
  setFetchedEthRecommendedAmount,
  setFetchedEthMinAmount,
}: {
  ethTokenInfo: TokenWithTradeInfo;
  defaultTokenInfo: TokenWithTradeInfo;
  selectedPaymentToken: TokenWithTradeInfo;
  setSelectedPaymentToken: (token: TokenWithTradeInfo) => void;
  defaultRecommendedAmount?: bigint;
  defaultMinAmount?: bigint;
  selectedPayAmount: bigint;
  setSelectedPayAmount: (amount: bigint) => void;
  setFetchedEthRecommendedAmount: (amount: bigint) => void;
  setFetchedEthMinAmount: (amount: bigint) => void;
}) {
  const {
    fetchSellAmountAsync: fetchEthAmountAsync,
    fetchBuyAmountAsync: fetchDefaultTokenAmountAsync,
    ready: swapReady,
  } = useSwap({
    sellToken: ethTokenInfo!,
    buyToken: defaultTokenInfo,
  });

  const {
    fetchSellAmount: fetchEthRecommendedAmount,
    sellAmount: fetchedEthRecommendedAmount,
    ready: swapRecommendedReady,
  } = useSwap({
    sellToken: ethTokenInfo!,
    buyToken: defaultTokenInfo,
    poolFee: UNISWAP_V3_DEGEN_ETH_POOL_FEES,
  });
  useEffect(() => {
    setFetchedEthRecommendedAmount(fetchedEthRecommendedAmount || 0n);
  }, [fetchedEthRecommendedAmount]);

  const {
    fetchSellAmount: fetchEthMinAmount,
    sellAmount: fetchedEthMinAmount,
    ready: swapMinReady,
  } = useSwap({
    sellToken: ethTokenInfo!,
    buyToken: defaultTokenInfo,
    poolFee: UNISWAP_V3_DEGEN_ETH_POOL_FEES,
  });
  useEffect(() => {
    setFetchedEthMinAmount(fetchedEthMinAmount || 0n);
  }, [fetchedEthMinAmount]);
  const handleTokenChange = async (token: TokenWithTradeInfo) => {
    if (token?.address === selectedPaymentToken?.address) {
      return;
    }
    if (!ethTokenInfo?.address) {
      return;
    }
    setSelectedPaymentToken(token);
    if (token?.address === ethTokenInfo?.address) {
      if (
        swapRecommendedReady &&
        defaultRecommendedAmount &&
        !fetchedEthRecommendedAmount
      ) {
        fetchEthRecommendedAmount(defaultRecommendedAmount);
      }
      if (swapMinReady && defaultMinAmount && !fetchedEthMinAmount) {
        fetchEthMinAmount(defaultMinAmount);
      }
    }
    if (Number(selectedPayAmount) === 0) {
      setSelectedPayAmount(0n);
      return;
    }
    if (!swapReady) {
      return;
    }
    try {
      if (token?.address === ethTokenInfo?.address) {
        const amount = await fetchEthAmountAsync(selectedPayAmount);
        setSelectedPayAmount(amount);
      } else {
        const amount = await fetchDefaultTokenAmountAsync(selectedPayAmount);
        setSelectedPayAmount(amount);
      }
    } catch (error) {
      console.log("fetch amount error", error);
    }
  };
  return (
    <UserTokenSelect
      selectToken={handleTokenChange}
      chain={ATT_CONTRACT_CHAIN}
      defaultToken={defaultTokenInfo}
    />
  );
}

export function PaymentInfo({
  paymentTokenInfo,
  recommendedPayAmount,
  minPayAmount,
  selectedPayAmount,
  setSelectedPayAmount,
  amountLoading,
  sliderStep,
  description,
  hideChallengeAmount,
}: {
  paymentTokenInfo: TokenWithTradeInfo;
  recommendedPayAmount: bigint;
  minPayAmount: bigint;
  selectedPayAmount: bigint;
  setSelectedPayAmount: (amount: bigint) => void;
  amountLoading?: boolean;
  sliderStep?: number;
  description?: string;
  hideChallengeAmount?: boolean;
}) {
  const maxAmountNumber = paymentTokenInfo?.rawBalance
    ? Number(
        formatUnits(
          paymentTokenInfo?.rawBalance as any,
          paymentTokenInfo?.decimals!,
        ),
      )
    : 0;
  const minPayAmountNumber =
    minPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(minPayAmount, paymentTokenInfo?.decimals!))
      : 0;
  const selectedPayAmountNumber =
    selectedPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(selectedPayAmount, paymentTokenInfo?.decimals!))
      : 0;
  const recommendedPayAmountNumber =
    recommendedPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(recommendedPayAmount, paymentTokenInfo?.decimals!))
      : 0;

  const priceSliderConfig = {
    value: selectedPayAmountNumber,
    max: maxAmountNumber,
    min: minPayAmountNumber,
    step: sliderStep || recommendedPayAmountNumber / 100,
    maximumFractionDigits:
      paymentTokenInfo?.address === NATIVE_TOKEN_ADDRESS ? 6 : 2,
  };

  return (
    <View className="flex flex-col gap-4">
      <PriceRow
        title={"Minimum Cost"}
        paymentTokenInfo={paymentTokenInfo}
        price={minPayAmount}
        onClickPriceValue={() => {
          if (minPayAmount) {
            setSelectedPayAmount(minPayAmount);
          }
        }}
      />

      {!hideChallengeAmount && !!recommendedPayAmount && (
        <PriceRow
          title={"Successfully Challenge"}
          paymentTokenInfo={paymentTokenInfo}
          price={recommendedPayAmount}
          isLoading={amountLoading}
          onClickPriceValue={() => {
            if (recommendedPayAmount) {
              setSelectedPayAmount(recommendedPayAmount);
            }
          }}
        />
      )}
      <Text className="text-center text-xs text-secondary">
        Risk DEGEN to vote and get rewarded for every mint.
      </Text>
      {description && (
        <Text className="text-center text-xs text-secondary">
          {description}
        </Text>
      )}
      <Slider
        {...priceSliderConfig}
        disabled={maxAmountNumber <= minPayAmountNumber}
        onValueChange={(v) => {
          if (!isNaN(Number(v))) {
            const vInt = Number(v);
            setSelectedPayAmount(
              parseUnits(vInt.toString(), paymentTokenInfo?.decimals!),
            );
          }
        }}
      />
      <PriceRangeRow {...priceSliderConfig} />
    </View>
  );
}

export function PaymentInfoWithProposed({
  paymentTokenInfo,
  recommendedPayAmount,
  minPayAmount,
  selectedPayAmount,
  setSelectedPayAmount,
  amountLoading,
  sliderStep,
}: {
  paymentTokenInfo: TokenWithTradeInfo;
  recommendedPayAmount?: bigint;
  minPayAmount: bigint;
  selectedPayAmount: bigint;
  setSelectedPayAmount: (amount: bigint) => void;
  amountLoading?: boolean;
  sliderStep?: number;
}) {
  const recommendedPayAmountNumber =
    recommendedPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(recommendedPayAmount, paymentTokenInfo?.decimals!))
      : 0;
  const minPayAmountNumber =
    minPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(minPayAmount, paymentTokenInfo?.decimals!))
      : 0;
  const selectedPayAmountNumber =
    selectedPayAmount && paymentTokenInfo?.decimals
      ? Number(formatUnits(selectedPayAmount, paymentTokenInfo?.decimals!))
      : 0;

  const priceSliderConfig = {
    value: paymentTokenInfo?.balance ? selectedPayAmountNumber : 0,
    max: Number(paymentTokenInfo?.balance || 0),
    min: paymentTokenInfo?.balance ? minPayAmountNumber || 0 : 0,
    step: sliderStep || recommendedPayAmountNumber / 100,
    maximumFractionDigits:
      paymentTokenInfo?.address === NATIVE_TOKEN_ADDRESS ? 6 : 2,
  };

  return (
    <View className="flex flex-col gap-4">
      <PriceRow
        title="Minimum Cost"
        paymentTokenInfo={paymentTokenInfo}
        price={minPayAmount}
        isLoading={amountLoading}
        onClickPriceValue={() => {
          if (minPayAmount) {
            setSelectedPayAmount(minPayAmount);
          }
        }}
      />
      <PriceRow
        title="Successfully Challenge"
        paymentTokenInfo={paymentTokenInfo}
        price={recommendedPayAmount}
        isLoading={amountLoading}
        onClickPriceValue={() => {
          if (recommendedPayAmount) {
            setSelectedPayAmount(recommendedPayAmount);
          }
        }}
      />
      <View className="flex flex-col items-center gap-2">
        <Text className="text-center text-xs text-secondary">
          Upvote and earn minting fee rewards upon success!
        </Text>
        <Text className="text-center text-xs text-secondary">or</Text>
        <Text className="text-center text-xs text-secondary">
          Downvote spam casts, if you win, you can share the staked funds from
          upvoters.
        </Text>
      </View>
      <Slider
        {...priceSliderConfig}
        disabled={!paymentTokenInfo?.balance}
        onValueChange={(v) => {
          if (!isNaN(Number(v))) {
            const vInt = Number(v);
            setSelectedPayAmount(
              parseUnits(vInt.toString(), paymentTokenInfo?.decimals!),
            );
          }
        }}
      />
      <PriceRangeRow {...priceSliderConfig} />
    </View>
  );
}
