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
import { eventBus, EventTypes } from "~/utils/eventBus";

const InviteCodeModal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  React.ComponentPropsWithoutRef<typeof Dialog>
>(({ ...props }, ref) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const subscription = eventBus.subscribe((event) => {
      console.log("event", event);
      if ((event as any).type === EventTypes.USER_SIGNUP_SHOW_INVITE_CODE_MODEL)
        setOpen(true);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <Dialog
      open={open}
      ref={ref}
      onOpenChange={(open) => {
        setOpen(open);
        eventBus.next({type: EventTypes.USER_SIGNUP_CLOSE_INVITE_CODE_MODEL});
      }}
    >
      <DialogContent className="w-screen">
        <DialogHeader>
          <DialogTitle>Invitation Code</DialogTitle>
        </DialogHeader>
        <InviteCodeForm
          onSuccess={() => {
            console.log("signup degencast successful!");
            setOpen(false);
          }}
          onFail={(error: unknown) => {
            console.log("Failed to signup degencast", error);
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
  const { signupDegencast } = useAuth();
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
        onPress={() =>
          signupDegencast(inviteCode).then(onSuccess)
        }
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
