import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Heart, Plus, Share2, X } from "../common/Icons";
import { Text } from "../ui/text";
import { Animated, Easing, TextProps, View, ViewProps } from "react-native";
import { Image } from "react-native";
import { CommentIcon2 } from "../common/SvgIcons";
import { useCallback, useEffect, useState } from "react";

export function ActionButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        " h-[50px] w-[50px] flex-col rounded-full bg-white p-0 active:bg-white active:opacity-100 web:hover:opacity-100",
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
      className={cn(
        "",
        liked
          ? " bg-[#F41F4C] active:bg-[#F41F4C] web:hover:bg-[#F41F4C]"
          : " bg-white active:bg-white web:hover:bg-white",
        className,
      )}
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
  showActions,
  showActionsChange,
  onLike,
  onGift,
  onShare,
  onComment,
  className,
  ...props
}: ViewProps & {
  liked: boolean;
  likeCount?: number;
  showActions: boolean;
  showActionsChange: (showActions: boolean) => void;
  onLike: () => void;
  onGift: () => void;
  onShare: () => void;
  onComment?: () => void;
}) => {
  const fadeAnimation = useState(new Animated.Value(showActions ? 1 : 0))[0];
  const toggleActions = useCallback(() => {
    showActionsChange(!showActions);
  }, [showActions, showActionsChange]);
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: showActions ? 1 : 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [showActions]);

  return (
    <View className={cn(" flex w-fit flex-col gap-5", className)} {...props}>
      <Animated.View
        style={[
          {
            opacity: fadeAnimation,
          },
        ]}
      >
        <View className={cn(" flex w-fit flex-col gap-5")}>
          <LikeButton
            className=" shadow-md shadow-primary"
            liked={liked}
            likeCount={likeCount}
            onPress={onLike}
          />
          <GiftButton className=" shadow-md shadow-primary" onPress={onGift} />
          <CommentButton
            className=" shadow-md shadow-primary"
            onPress={onComment}
          />
          <ShareButton
            className=" shadow-md shadow-primary"
            onPress={onShare}
          />
        </View>
      </Animated.View>
      <ActionButton
        className=" shadow-md shadow-primary"
        onPress={toggleActions}
      >
        {showActions ? (
          <X size={24} className={cn(" fill-primary stroke-primary")} />
        ) : (
          <Plus size={24} className={cn(" fill-primary stroke-primary")} />
        )}
      </ActionButton>
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
          className={cn(" h-10 w-10 ", liked && " border-none")}
          variant={liked ? "default" : "outline"}
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
