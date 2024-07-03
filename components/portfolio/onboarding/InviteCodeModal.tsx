import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import useAuth, { SigninStatus } from "~/hooks/user/useAuth";

const InviteCodeModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  React.ComponentPropsWithoutRef<typeof Dialog>
>(({ ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { status, logout } = useAuth();
  useEffect(() => {
    const needInviteCode = async () => {
      if (status === SigninStatus.NEED_INVITE_CODE) setOpen(true);
    };
    needInviteCode();
  }, [status]);

  return (
    <Dialog
      open={open}
      ref={ref}
      onOpenChange={(open) => {
        console.log("open", open);
        logout();
        setOpen(open);
      }}
    >
      <DialogContent className="w-screen">
        <DialogHeader>
          <DialogTitle>Invitation Code</DialogTitle>
        </DialogHeader>
        <InviteCodeForm
          onSuccess={() => {
            console.log("signup degencast successful!");
          }}
          onFail={(error: unknown) => {
            console.log("Failed to signup degencast", error);
            logout();
          }}
        />
      </DialogContent>
    </Dialog>
  );
});
export default InviteCodeModal;

export function InviteCodeForm({
  onSuccess,
  onFail,
  showCancelButton = false,
}: {
  onSuccess: () => void;
  onFail: (error: unknown) => void;
  showCancelButton?: boolean;
}) {
  const { signup } = useAuth();
  const [inviteCode, setInviteCode] = useState<string>("");

  return (
    <View className="w-full flex-row items-center gap-1 rounded-full border-2 border-secondary bg-white p-1">
      <Input
        className="flex-1 rounded-full border-none bg-transparent px-4 text-secondary"
        placeholder="Fill in invitation code"
        value={inviteCode}
        onChangeText={(newText) => setInviteCode(newText)}
      />
      <Button
        variant="default"
        className="rounded-full"
        disabled={!inviteCode}
        onPress={() => signup(inviteCode)}
      >
        <Text>Submit</Text>
      </Button>
      {showCancelButton && (
        <Button
          variant="default"
          className="rounded-full"
          onPress={() => {
            setInviteCode("");
            onFail("user cancel sign in!");
          }}
        >
          <Text>Cancel</Text>
        </Button>
      )}
    </View>
  );
}
