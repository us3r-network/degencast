import { Address } from "viem";
import { useAccount, useChainId, useChains, useSwitchChain } from "wagmi";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { NATIVE_TOKEN_ADDRESS } from "~/constants";
import { useERC20Approve } from "~/hooks/trade/useERC20Contract";
import useWalletAccount from "~/hooks/user/useWalletAccount";

type OnChainActionButtonWarperProps = React.ComponentPropsWithoutRef<
  typeof Button
> & {
  warpedButton?: React.ReactElement;
  approveText?: string;
};

export default function OnChainActionButtonWarper({
  warpedButton,
  approveText,
  targetChainId,
  allowanceParams,
  ...props
}: OnChainActionButtonWarperProps & {
  allowanceParams?: AllowanceProps;
} & SwitchChainButtonProps) {
  const { supportAtomicBatch } = useWalletAccount();
  if (
    !allowanceParams ||
    allowanceParams.tokenAddress === NATIVE_TOKEN_ADDRESS ||
    (targetChainId && supportAtomicBatch(targetChainId))
  )
    return (
      <SwitchChainButtonWarper
        targetChainId={targetChainId}
        warpedButton={warpedButton}
        {...props}
      />
    );
  return (
    <ApproveButtonWarper
      allowanceParams={allowanceParams}
      text={approveText}
      warpedButton={
        <SwitchChainButtonWarper
          targetChainId={targetChainId}
          warpedButton={warpedButton}
          {...props}
        />
      }
      {...props}
    />
  );
}

type ApproveButtonProps = {
  allowanceParams: AllowanceProps;
  text?: string;
};

type AllowanceProps = {
  owner: Address;
  tokenAddress: Address;
  spender: Address;
  value: bigint;
};

function ApproveButtonWarper({
  warpedButton,
  allowanceParams,
  text,
  ...props
}: OnChainActionButtonWarperProps & ApproveButtonProps) {
  const { owner, tokenAddress, spender, value } = allowanceParams;
  const { allowance, approve, waiting, writing } = useERC20Approve({
    owner,
    tokenAddress,
    spender,
  });
  // console.log("allowance", allowance);
  if (allowance === 0n || (!!allowance && allowance < value))
    return (
      <Button
        disabled={waiting || writing}
        onPress={async () => {
          await approve(value);
        }}
        {...props}
      >
        <Text>{text || "Approve"}</Text>
      </Button>
    );
  else return warpedButton;
}

type SwitchChainButtonProps = {
  targetChainId?: number;
};

function SwitchChainButtonWarper({
  warpedButton,
  targetChainId,
  ...props
}: OnChainActionButtonWarperProps & SwitchChainButtonProps) {
  const { connectWallet } = useWalletAccount();
  const { address, isConnected } = useAccount();
  const { switchChain, status: switchChainStatus } = useSwitchChain();
  const chainId = useChainId();
  const chains = useChains();
  const targetChain = chains.find((c) => c.id === targetChainId);
  if (targetChainId && targetChain && targetChainId !== chainId) {
    if (!isConnected) {
      return (
        <Button
          disabled={switchChainStatus === "pending"}
          onPress={async () => {
            connectWallet();
          }}
          {...props}
        >
          <Text>Connect Wallet</Text>
        </Button>
      );
    }
    return (
      <Button
        disabled={switchChainStatus === "pending"}
        onPress={async () => {
          await switchChain({ chainId: targetChainId });
        }}
        {...props}
      >
        <Text>Switch to {targetChain.name}</Text>
      </Button>
    );
  } else return warpedButton;
}
