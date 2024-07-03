import { useState } from "react";
import { View } from "react-native";
import { LogOut } from "~/components/common/Icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useAuth from "~/hooks/user/useAuth";

export default function UserLogout() {
  const { authenticated, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!ready || !authenticated) {
    return null;
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Button
          size={"icon"}
          className="size-6 rounded-full bg-secondary"
          onPress={async () => {
            await logout();
          }}
        >
          <Text>
            <LogOut size={16} />
          </Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-screen bg-primary">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-2 text-primary-foreground">
            Notice
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="alert-dialog-desc text-primary-foreground">
          Are you sure you want to log out?
        </AlertDialogDescription>
        <View className="w-full flex-row items-center justify-stretch gap-2">
          <Button
            variant={"secondary"}
            className="flex-1"
            onPress={() => setOpen(false)}
          >
            <Text>No</Text>
          </Button>
          <Button variant={"secondary"} className="flex-1" onPress={logout}>
            <Text>Yes</Text>
          </Button>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
