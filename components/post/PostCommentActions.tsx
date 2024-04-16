import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Heart, Share2 } from "../common/Icons";
import { Text } from "../ui/text";
import { TextProps, View, ViewProps } from "react-native";
import { Image } from "expo-image";

export function ActionButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        " h-fit w-fit flex-row items-center gap-1 rounded-none bg-none p-0",
        className,
      )}
      {...props}
    />
  );
}

export function ActionText({ className, ...props }: TextProps) {
  return (
    <Text className={cn("text-xs text-secondary", className)} {...props} />
  );
}

export const LikeButton = ({
  liked,
  likeCount,
  className,
  iconSize = 24,
  ...props
}: ButtonProps & {
  liked: boolean;
  likeCount: number;
  iconSize?: number;
}) => {
  return (
    <ActionButton className={cn("", className)} {...props}>
      <Heart
        size={iconSize}
        className={cn(
          " fill-primary stroke-primary",
          liked && " fill-primary-foreground stroke-primary-foreground",
        )}
      />
      <ActionText className={cn("", liked && " text-secondary-foreground")}>
        {likeCount || 0}
      </ActionText>
    </ActionButton>
  );
};

export const GiftButton = ({
  iconSize = 24,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionButton {...props}>
      <Image
        source={require("~/assets/images/degen-icon.png")}
        style={{ width: iconSize, height: iconSize }}
      />
      {/* <ActionText>{giftCount || 0}</ActionText> */}
    </ActionButton>
  );
};

export const ShareButton = ({
  iconSize,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionButton {...props}>
      <Share2 size={iconSize} className={cn(" fill-primary stroke-primary")} />
    </ActionButton>
  );
};

export const PostCommentActions = ({
  liked,
  likeCount,
  onLike,
  onGift,
  onShare,
  className,
  ...props
}: ViewProps & {
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onGift: () => void;
  onShare: () => void;
}) => {
  return (
    <View className={cn(" flex w-fit flex-row gap-3", className)} {...props}>
      <LikeButton liked={liked} likeCount={likeCount} onPress={onLike} />
      <GiftButton onPress={onGift} />
      <ShareButton onPress={onShare} />
    </View>
  );
};
