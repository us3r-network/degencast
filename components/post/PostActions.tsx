import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import {
  DollarSign,
  Heart,
  Plus,
  Repeat,
  Share2,
  SquarePen,
  X,
} from "../common/Icons";
import { Text } from "../ui/text";
import {
  ActivityIndicator,
  Animated,
  Easing,
  TextProps,
  View,
  ViewProps,
  Pressable,
} from "react-native";
import { Image } from "react-native";
import {
  CommentIcon2,
  DegenIcon,
  EditIcon,
  MintIcon,
} from "../common/SvgIcons";
import {
  forwardRef,
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "expo-router";
import useAppSettings from "~/hooks/useAppSettings";
import React from "react";

export const ActionButton = forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      className={cn(
        " h-[42px] w-[42px] flex-col rounded-full bg-[#9151C3] p-0 active:bg-[#9151C3] active:opacity-100 web:hover:opacity-100",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export function ActionText({ className, ...props }: TextProps) {
  return <Text className={cn("text-xs text-white", className)} {...props} />;
}

function ActionMenuItem({
  index,
  children,
  size = 36,
}: {
  children: React.ReactNode;
  index: number;
  size?: number;
}) {
  const {
    direction,
    showMenu,
    scaleAnimatedValue,
    translateYAnimatedValue,
    translateXAnimatedValue,
  } = useActionMenuCtx();

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

  const gap = 10;
  const offset = size + gap;

  const translateStyle = useMemo(() => {
    switch (direction) {
      case "top":
        return {
          translateY: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(offset * index)],
          }),
        };
      case "left":
        return {
          translateX: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(offset * index)],
          }),
        };
      default:
        return {
          translateY: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(offset * index)],
          }),
        };
    }
  }, [translateYAnimatedValue, direction]);
  const actionStyle = {
    width: 36,
    height: 36,
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
      translateStyle,
    ],
  };
  return <Animated.View style={[actionStyle]}>{children}</Animated.View>;
}

const ActionMenuItemButton = forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <ActionButton
      ref={ref}
      className={cn(" h-[36px] w-[36px]", className)}
      {...props}
    />
  );
});

export const LikeButton = ({
  liked,
  liking,
  likeCount,
  className,
  iconSize = 16,
  ...props
}: ButtonProps & {
  liked: boolean;
  liking?: boolean;
  likeCount?: number;
  iconSize?: number;
}) => {
  return (
    <ActionMenuItemButton
      className={cn(
        "gap-0 active:opacity-100",
        liked
          ? " bg-[#F41F4C] active:bg-[#F41F4C] web:hover:bg-[#F41F4C]"
          : " bg-[#9151C3] active:bg-[#9151C3] web:hover:bg-[#9151C3]",
        className,
      )}
      {...props}
    >
      {liking ? (
        <ActivityIndicator size={iconSize} color={"white"} />
      ) : (
        <Heart
          size={iconSize}
          className={cn(" fill-primary-foreground stroke-primary-foreground")}
        />
      )}

      {likeCount !== undefined && <ActionText>{likeCount || 0}</ActionText>}
    </ActionMenuItemButton>
  );
};

export const RepostButton = ({
  iconSize = 16,
  reposted,
  reposting,
  ...props
}: ButtonProps & {
  iconSize?: number;
  reposted?: boolean;
  reposting?: boolean;
}) => {
  return (
    <ActionMenuItemButton {...props}>
      {reposting ? (
        <ActivityIndicator
          size={iconSize}
          color={reposted ? "#00D1A7" : "#fff"}
        />
      ) : (
        <Repeat
          size={iconSize}
          className={cn(
            " stroke-primary-foreground",
            reposted && " stroke-[#00D1A7] ",
          )}
        />
      )}
    </ActionMenuItemButton>
  );
};

export const GiftButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionMenuItemButton {...props}>
      <DollarSign size={iconSize} className={cn("stroke-primary-foreground")} />
      {/* <ActionText>{giftCount || 0}</ActionText> */}
    </ActionMenuItemButton>
  );
};

export const CommentButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionMenuItemButton {...props}>
      <CommentIcon2
        width={iconSize}
        height={iconSize}
        className={cn(
          " flex fill-primary-foreground stroke-primary-foreground",
        )}
      />
    </ActionMenuItemButton>
  );
};

export const ShareButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionMenuItemButton {...props}>
      <Share2
        size={iconSize}
        className={cn(" fill-primary-foreground stroke-primary-foreground")}
      />
    </ActionMenuItemButton>
  );
};

export const MintButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionMenuItemButton {...props}>
      <MintIcon className={cn("stroke-primary-foreground")} />
    </ActionMenuItemButton>
  );
};

type ExplorePostActionsProps = {
  direction?: "top" | "left";
  channelId?: string;
  liked: boolean;
  likeCount?: number;
  liking?: boolean;
  reposted?: boolean;
  reposting?: boolean;
  onLike: () => void;
  onGift: () => void;
  onShare: () => void;
  onComment?: () => void;
  onMint?: () => void;
  onRepost?: () => void;
};
const ActionMenuCtx = React.createContext<{
  showMenu?: boolean;
  direction?: "top" | "left";
  scaleAnimatedValue: Animated.Value;
  translateYAnimatedValue: Animated.Value;
  translateXAnimatedValue: Animated.Value;
}>({
  showMenu: false,
  direction: "left",
  scaleAnimatedValue: new Animated.Value(0),
  translateYAnimatedValue: new Animated.Value(0),
  translateXAnimatedValue: new Animated.Value(0),
});
function useActionMenuCtx() {
  const context = useContext(ActionMenuCtx);
  if (!context) {
    throw new Error("useActionMenuCtx must be used within ActionMenuCtx");
  }
  return context;
}
export const ExplorePostActions = forwardRef(function (
  {
    direction = "left",
    channelId,
    liked,
    likeCount,
    liking,
    reposted,
    reposting,
    onLike,
    onGift,
    onShare,
    onComment,
    onMint,
    onRepost,

    className,
    ...props
  }: ViewProps & ExplorePostActionsProps,
  ref: LegacyRef<View>,
) {
  // const {
  //   openExploreCastMenu: showActions,
  //   setOpenExploreCastMenu: showActionsChange,
  // } = useAppSettings();
  const [showActions, showActionsChange] = useState(false);
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
  const translateXAnimatedValue = useState(new Animated.Value(0))[0];
  const openIconDeg = useMemo(() => {
    switch (direction) {
      case "left":
        return "90deg";
      case "top":
        return "180deg";
      default:
        return "90deg";
    }
  }, [direction]);
  return (
    <View
      ref={ref}
      className={cn(
        " relative z-0 flex w-fit flex-col items-center",
        direction === "left" ? " h-fit flex-row" : "",
        className,
      )}
      {...props}
    >
      <ActionMenuCtx.Provider
        value={{
          showMenu: showActions,
          direction,
          scaleAnimatedValue,
          translateYAnimatedValue,
          translateXAnimatedValue,
        }}
      >
        {/* <ActionMenuItem
        index={5}
      >
        <GiftButton  onPress={onGift} />
      </ActionMenuItem> */}
        <ActionMenuItem index={4}>
          <Link
            href={`/create${channelId ? "?channelId=" + channelId : ""}`}
            asChild
          >
            <ActionMenuItemButton>
              <SquarePen
                size={16}
                strokeWidth={2}
                className="stroke-primary-foreground"
              />
            </ActionMenuItemButton>
          </Link>
        </ActionMenuItem>

        <ActionMenuItem index={3}>
          <CommentButton onPress={onComment} />
        </ActionMenuItem>
        {/* <ActionMenuItem index={3}>
          <MintButton onPress={onMint} />
        </ActionMenuItem> */}
        <ActionMenuItem index={2}>
          {/* <ShareButton  onPress={onShare} /> */}
          <RepostButton
            disabled={reposting}
            reposted={reposted}
            reposting={reposting}
            onPress={onRepost}
          />
        </ActionMenuItem>
        <ActionMenuItem index={1}>
          <LikeButton
            disabled={liking}
            liked={liked}
            liking={liking}
            likeCount={likeCount}
            onPress={onLike}
          />
        </ActionMenuItem>
      </ActionMenuCtx.Provider>
      <ActionButton className=" z-10" onPress={toggleActions}>
        <Animated.View
          style={[
            {
              transform: [
                {
                  rotate: toggleBtnAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", openIconDeg],
                  }),
                },
              ],
            },
          ]}
        >
          {/* <Image
            source={require("~/assets/images/degen-icon.png")}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          /> */}
          <DegenIcon />
        </Animated.View>
      </ActionButton>
      {/* <Link
        href={`/create${channelId ? "?channelId=" + channelId : ""}`}
        asChild
      >
        <ActionButton className="z-10 mt-3 shadow-md shadow-primary">
          <SquarePen size={20} strokeWidth={2} className="stroke-primary" />
        </ActionButton>
      </Link> */}
    </View>
  );
});

type PostDetailActionsProps = {
  liked?: boolean;
  likeCount?: number;
  liking?: boolean;
  reposted?: boolean;
  reposting?: boolean;
  onLike?: () => void;
  onGift?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  onMint?: () => void;
  onRepost?: () => void;
  hideLike?: boolean;
  hideGift?: boolean;
  hideShare?: boolean;
  hideComment?: boolean;
};
export const PostDetailActions = forwardRef(function (
  {
    liked = false,
    likeCount,
    liking,
    reposted,
    reposting,
    onLike,
    onGift,
    onShare,
    onComment,
    onMint,
    onRepost,
    hideLike,
    hideGift,
    hideShare,
    hideComment,
    className,
    ...props
  }: ViewProps & PostDetailActionsProps,
  ref: LegacyRef<View>,
) {
  return (
    <View
      className={cn(" flex w-fit flex-row gap-3", className)}
      ref={ref}
      {...props}
    >
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

      {/* {!hideShare && (
        <ShareButton
          variant={"outline"}
          iconSize={15}
          className=" h-10 w-10"
          onPress={onShare}
        />
      )} */}

      <RepostButton
        variant={"outline"}
        iconSize={15}
        className=" h-10 w-10"
        reposted={reposted}
        reposting={reposting}
        onPress={onRepost}
        disabled={reposting}
      />

      {!hideLike && (
        <LikeButton
          className={cn(" h-10 w-10 ", liked && " border-none")}
          variant={liked ? "default" : "outline"}
          disabled={liking}
          iconSize={15}
          liked={liked}
          liking={liking}
          likeCount={likeCount}
          onPress={onLike}
        />
      )}
    </View>
  );
});
