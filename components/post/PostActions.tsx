import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Heart, Share2 } from "../Icons";
import { Text } from "../ui/text";
import { TextProps, View, ViewProps } from "react-native";
import { Image } from "expo-image";

export function ActionButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        " h-[60px] w-[60px] flex-col rounded-full bg-white p-0 shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function ActionText({ className, ...props }: TextProps) {
  return <Text className={cn("text-xs text-primary", className)} {...props} />;
}

export const LikeButton = ({
  liked,
  likeCount,
  ...props
}: ButtonProps & {
  liked: boolean;
  likeCount: number;
}) => {
  return (
    <ActionButton {...props}>
      <Heart className={cn(" stroke-primary", liked && "fill-primary")} />
      <ActionText>{likeCount || 0}</ActionText>
    </ActionButton>
  );
};

export const GiftButton = ({
  giftCount,
  ...props
}: ButtonProps & { giftCount: number }) => {
  return (
    <ActionButton {...props}>
      <Image
        source={require("~/assets/images/degen-icon.png")}
        style={{ width: 24, height: 20 }}
      />
      <ActionText>{giftCount || 0}</ActionText>
    </ActionButton>
  );
};

export const ShareButton = ({ ...props }: ButtonProps) => {
  return (
    <ActionButton {...props}>
      <Share2 className={cn(" fill-primary stroke-primary")} />
    </ActionButton>
  );
};

export const ExplorePostActions = ({
  liked,
  likeCount,
  giftCount,
  onLike,
  onGift,
  onShare,
  className,
  ...props
}: ViewProps & {
  liked: boolean;
  likeCount: number;
  giftCount: number;
  onLike: () => void;
  onGift: () => void;
  onShare: () => void;
}) => {
  return (
    <View className={cn(" flex w-fit flex-col gap-3", className)} {...props}>
      <LikeButton liked={liked} likeCount={likeCount} onPress={onLike} />
      <GiftButton giftCount={giftCount} onPress={onGift} />
      <ShareButton onPress={onShare} />
    </View>
  );
};
