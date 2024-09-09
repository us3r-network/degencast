import { useEffect } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { CircleHelp, UserPlus } from "~/components/common/Icons";
import { InviteCodeCopy } from "~/components/point/PointsRules";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { SECONDARY_COLOR } from "~/constants";
import useUserInvitationCodes from "~/hooks/user/useUserInvitationCodes";
import { cn } from "~/lib/utils";

export default function InviteButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m-0 p-0">
          <UserPlus className="stroke-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader className={cn("flex gap-4")}>
          <DialogTitle>Invite</DialogTitle>
          <Separator className="h-[1px] bg-white" />
        </DialogHeader>
        <InviteContent />
      </DialogContent>
    </Dialog>
  );
}

export function InviteContent() {
  const { loading, rejected, loadMyInvitationCodes, invitationCodes } =
    useUserInvitationCodes();
  useEffect(() => {
    if (loading || rejected || invitationCodes.length > 0) return;
    loadMyInvitationCodes();
  }, [loading, rejected, invitationCodes]);
  const showInviteCode = invitationCodes.find((item) => !item?.isUsed);
  return (
    <View>
      {loading ? (
        <ActivityIndicator size={20} color={SECONDARY_COLOR} />
      ) : !!showInviteCode ? (
        <InviteCodeCopy inviteCode={showInviteCode.code} />
      ) : (
        <Text className="text-center text-sm font-normal text-secondary">
          No more invitation codes for you now
        </Text>
      )}
    </View>
  );
}
