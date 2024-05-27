import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Heart, Plus, Share2, X } from "../common/Icons";
import { Text } from "../ui/text";
import { Animated, Easing, TextProps, View, ViewProps } from "react-native";
import { Image } from "react-native";
import { CommentIcon2 } from "../common/SvgIcons";
import { useCallback, useEffect, useState } from "react";
import { Image as ImageIcon } from "~/components/common/Icons";

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
  iconSize = 24,
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

export const MintButton = ({
  iconSize = 24,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionButton {...props}>
      <ImageIcon size={iconSize} className={cn("stroke-primary")} />
    </ActionButton>
  );
};

function ActionMenuItem({
  scaleAnimatedValue,
  translateYAnimatedValue,
  showMenu,
  index,
  children,
}: {
  children: React.ReactNode;
  scaleAnimatedValue: Animated.Value;
  translateYAnimatedValue: Animated.Value;
  showMenu: boolean;
  index: number;
}) {
  useEffect(() => {
    Animated.timing(scaleAnimatedValue, {
      toValue: showMenu ? 1 : 0,
      duration: 200 * index,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateYAnimatedValue, {
      toValue: showMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showMenu]);
  const actionStyle = {
    position: "absolute" as "absolute",
    zIndex: index,

    opacity: scaleAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: scaleAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      {
        translateY: translateYAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(70 * index)],
        }),
      },
    ],
  };
  return <Animated.View style={[actionStyle]}>{children}</Animated.View>;
}

export const ExplorePostActions = ({
  liked,
  likeCount,
  showActions,
  showActionsChange,
  onLike,
  onGift,
  onShare,
  onComment,
  onMint,
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
  onMint?: () => void;
}) => {
  const toggleBtnAnimation = useState(new Animated.Value(0))[0];
  const toggleActions = useCallback(() => {
    showActionsChange(!showActions);
  }, [showActions, showActionsChange]);
  useEffect(() => {
    Animated.timing(toggleBtnAnimation, {
      toValue: showActions ? 1 : 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [showActions]);
  const scaleAnimatedValue = useState(new Animated.Value(0))[0];
  const translateYAnimatedValue = useState(new Animated.Value(0))[0];

  return (
    <View
      className={cn(
        " relative z-0 flex w-fit flex-col items-center",
        className,
      )}
      {...props}
    >
      <ActionMenuItem
        showMenu={showActions}
        scaleAnimatedValue={scaleAnimatedValue}
        translateYAnimatedValue={translateYAnimatedValue}
        index={5}
      >
        <LikeButton
          className=" shadow-md shadow-primary"
          liked={liked}
          likeCount={likeCount}
          onPress={onLike}
        />
      </ActionMenuItem>
      <ActionMenuItem
        showMenu={showActions}
        scaleAnimatedValue={scaleAnimatedValue}
        translateYAnimatedValue={translateYAnimatedValue}
        index={4}
      >
        <GiftButton className=" shadow-md shadow-primary" onPress={onGift} />
      </ActionMenuItem>
      <ActionMenuItem
        showMenu={showActions}
        scaleAnimatedValue={scaleAnimatedValue}
        translateYAnimatedValue={translateYAnimatedValue}
        index={3}
      >
        <CommentButton
          className=" shadow-md shadow-primary"
          onPress={onComment}
        />
      </ActionMenuItem>
      <ActionMenuItem
        showMenu={showActions}
        scaleAnimatedValue={scaleAnimatedValue}
        translateYAnimatedValue={translateYAnimatedValue}
        index={2}
      >
        <MintButton className=" shadow-md shadow-primary" onPress={onMint} />
      </ActionMenuItem>
      <ActionMenuItem
        showMenu={showActions}
        scaleAnimatedValue={scaleAnimatedValue}
        translateYAnimatedValue={translateYAnimatedValue}
        index={1}
      >
        <ShareButton className=" shadow-md shadow-primary" onPress={onShare} />
      </ActionMenuItem>
      <ActionButton
        className=" z-10 h-[60px] w-[60px] shadow-md shadow-primary"
        onPress={toggleActions}
      >
        <Animated.View
          style={[
            {
              transform: [
                {
                  rotate: toggleBtnAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Plus size={30} className={cn(" fill-primary stroke-primary")} />
        </Animated.View>
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
  onMint,
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
  onMint?: () => void;
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

      <MintButton
        variant={"outline"}
        iconSize={15}
        className=" h-10 w-10"
        onPress={onMint}
      />

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
