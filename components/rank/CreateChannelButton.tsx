import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import CreateChannelDialog from "./CreateChannelModal";

export default function CreateChannelButton({
  renderButton,
}: {
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {renderButton ? (
        renderButton({ onPress: () => setOpen(true) })
      ) : (
        <Button variant={"secondary"} onPress={() => setOpen(true)}>
          <Text>Create Channel</Text>
        </Button>
      )}
      <CreateChannelDialog open={open} setOpen={setOpen} />
    </>
  );
}
