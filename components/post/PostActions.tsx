import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Heart, Share2 } from "../common/Icons";
import { Text } from "../ui/text";
import { TextProps, View, ViewProps } from "react-native";
import { Image } from "react-native";
import { CommentIcon2 } from "../common/SvgIcons";

export function ActionButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        " h-[60px] w-[60px] flex-col rounded-full bg-white p-0",
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
  className,
  iconSize = 24,
  ...props
}: ButtonProps & {
  liked: boolean;
  likeCount?: number;
  iconSize?: number;
}) => {
  return (
    <ActionButton
      className={cn("", liked && " bg-[#F41F4C]", className)}
      {...props}
    >
      <Heart
        size={iconSize}
        className={cn(
          " fill-primary stroke-primary",
          liked && " fill-primary-foreground stroke-primary-foreground",
        )}
      />
      {likeCount !== undefined && (
        <ActionText className={cn("", liked && " text-primary-foreground")}>
          {likeCount || 0}
        </ActionText>
      )}
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
        resizeMode="contain"
        style={{ width: iconSize, height: iconSize }}
      />
      {/* <ActionText>{giftCount || 0}</ActionText> */}
    </ActionButton>
  );
};

export const CommentButton = ({
  iconSize = 24,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionButton {...props}>
      <CommentIcon2
        width={iconSize}
        height={iconSize}
        className={cn(" flex fill-primary stroke-primary")}
      />
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

export const ExplorePostActions = ({
  liked,
  likeCount,
  onLike,
  onGift,
  onShare,
  onComment,
  className,
  ...props
}: ViewProps & {
  liked: boolean;
  likeCount?: number;
  onLike: () => void;
  onGift: () => void;
  onShare: () => void;
  onComment?: () => void;
}) => {
  return (
    <View className={cn(" flex w-fit flex-col gap-3", className)} {...props}>
      <LikeButton
        className=" shadow-md"
        liked={liked}
        likeCount={likeCount}
        onPress={onLike}
      />
      <GiftButton className=" shadow-md" onPress={onGift} />
      <CommentButton className=" shadow-md" onPress={onComment} />
      <ShareButton className=" shadow-md" onPress={onShare} />
    </View>
  );
};

export const PostDetailActions = ({
  liked = false,
  likeCount,
  onLike,
  onGift,
  onShare,
  onComment,
  hideLike,
  hideGift,
  hideShare,
  hideComment,
  className,
  ...props
}: ViewProps & {
  liked?: boolean;
  likeCount?: number;
  onLike?: () => void;
  onGift?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  hideLike?: boolean;
  hideGift?: boolean;
  hideShare?: boolean;
  hideComment?: boolean;
}) => {
  return (
    <View className={cn(" flex w-fit flex-row gap-3", className)} {...props}>
      {!hideLike && (
        <LikeButton
          className={cn(" h-10 w-10", liked && " border-none")}
          variant={"outline"}
          iconSize={15}
          liked={liked}
          likeCount={likeCount}
          onPress={onLike}
        />
      )}

      {!hideGift && (
        <GiftButton
          variant={"outline"}
          iconSize={15}
          className=" h-10 w-10"
          onPress={onGift}
        />
      )}

      {!hideComment && (
        <CommentButton
          variant={"outline"}
          iconSize={15}
          className=" h-10 w-10"
          onPress={onComment}
        />
      )}

      {!hideShare && (
        <ShareButton
          variant={"outline"}
          iconSize={15}
          className=" h-10 w-10"
          onPress={onShare}
        />
      )}
    </View>
  );
};
