import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Heart, Share2 } from "../common/Icons";
import { Text } from "../ui/text";
import {
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";
import { Image } from "expo-image";

export type ActionButtonProps = TouchableOpacityProps;

export function ActionButton({ className, ...props }: ActionButtonProps) {
  return (
    <TouchableOpacity
      className={cn(" h-fit w-fit flex-row items-center gap-1 ", className)}
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
}: ActionButtonProps & {
  liked: boolean;
  likeCount: number;
  iconSize?: number;
}) => {
  return (
    <ActionButton className={cn("", className)} {...props}>
      <Heart
        size={iconSize}
        className={cn(
          " stroke-secondary",
          liked && " fill-[#F41F4C] stroke-[#F41F4C] ",
        )}
      />
      <ActionText className={cn(" text-secondary", liked && " text-[#F41F4C]")}>
        {likeCount || 0}
      </ActionText>
    </ActionButton>
  );
};

export const CommentButton = ({
  iconSize = 24,
  ...props
}: ActionButtonProps & {
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
}: ActionButtonProps & {
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
  onComment,
  onShare,
  className,
  ...props
}: ViewProps & {
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}) => {
  return (
    <View className={cn(" flex w-fit flex-row gap-3", className)} {...props}>
      <CommentButton onPress={onComment} />
      <ShareButton onPress={onShare} />
      <LikeButton liked={liked} likeCount={likeCount} onPress={onLike} />
    </View>
  );
};
