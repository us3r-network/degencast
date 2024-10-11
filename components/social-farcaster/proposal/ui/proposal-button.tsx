import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { ProposalTextClassContext } from "./proposal-text";

const buttonVariants = cva(
  "group w-full flex flex-row gap-1 items-center justify-center rounded-md web:hover:opacity-90 active:opacity-90",
  {
    variants: {
      variant: {
        "not-proposed": "bg-proposalNotProposed",
        "proposed-free": "border border-proposalNotProposed bg-[#F2B94966]",
        proposed: "bg-proposalProposed",
        accepted: "bg-proposalAccepted",
        disputed: "bg-proposalDisputed",
        "ready-to-mint": "bg-proposalReadyToMint",
        // TODO bg-proposalMintExpired/20 失效 用bg-[#9151C333]代替
        "mint-expired": "border border-proposalMintExpired bg-[#9151C333]",
        // TODO bg-proposalAbandoned/20 失效 用bg-[#F41F4C33]代替
        abandoned: "border border-proposalAbandoned bg-[#F41F4C33]",
      },
      size: {
        default: "h-8 px-3 py-3 native:h-12 native:px-5 native:py-3",
      },
    },
    defaultVariants: {
      variant: "not-proposed",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sx native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        "not-proposed": "text-proposalNotProposed-foreground",
        "proposed-free": "text-proposalNotProposed-foreground",
        proposed: "text-proposalProposed-foreground",
        accepted: "text-proposalAccepted-foreground",
        disputed: "text-proposalDisputed-foreground",
        "ready-to-mint": "text-proposalReadyToMint-foreground",
        "mint-expired": "text-proposalMintExpired-foreground",
        abandoned: "text-proposalAbandoned-foreground",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "not-proposed",
      size: "default",
    },
  },
);

type ProposalButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const ProposalButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ProposalButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <ProposalTextClassContext.Provider
      value={cn(
        props.disabled && "web:pointer-events-none",
        buttonTextVariants({ variant, size }),
      )}
    >
      <Pressable
        className={cn(
          props.disabled && "opacity-50 web:pointer-events-none",
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        role="button"
        {...props}
      />
    </ProposalTextClassContext.Provider>
  );
});
ProposalButton.displayName = "ProposalButton";

export { ProposalButton, buttonTextVariants, buttonVariants };
export type { ProposalButtonProps };
