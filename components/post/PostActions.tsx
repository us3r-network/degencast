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
import { CommentIcon2, EditIcon, MintIcon } from "../common/SvgIcons";
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
        " h-[42px] w-[42px] flex-col rounded-full bg-white p-0 active:bg-white active:opacity-100 web:hover:opacity-100",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export function ActionText({ className, ...props }: TextProps) {
  return <Text className={cn("text-xs text-primary", className)} {...props} />;
}

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
    <ActionButton
      className={cn(
        "active:opacity-100",
        liked
          ? " bg-[#F41F4C] active:bg-[#F41F4C] web:hover:bg-[#F41F4C]"
          : " bg-white active:bg-white web:hover:bg-white",
        className,
      )}
      {...props}
    >
      {liking ? (
        <ActivityIndicator
          size={iconSize}
          color={liked ? "white" : "#4C2896"}
        />
      ) : (
        <Heart
          size={iconSize}
          className={cn(
            " fill-primary stroke-primary",
            liked && " fill-primary-foreground stroke-primary-foreground",
          )}
        />
      )}

      {likeCount !== undefined && (
        <ActionText className={cn("", liked && " text-primary-foreground")}>
          {likeCount || 0}
        </ActionText>
      )}
    </ActionButton>
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
    <ActionButton {...props}>
      {reposting ? (
        <ActivityIndicator
          size={iconSize}
          color={reposted ? "#00D1A7" : "#4C2896"}
        />
      ) : (
        <Repeat
          size={iconSize}
          className={cn(" stroke-primary", reposted && " stroke-[#00D1A7] ")}
        />
      )}
    </ActionButton>
  );
};

export const GiftButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionButton {...props}>
      <DollarSign size={iconSize} className={cn("stroke-primary")} />
      {/* <ActionText>{giftCount || 0}</ActionText> */}
    </ActionButton>
  );
};

export const CommentButton = ({
  iconSize = 16,
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
  iconSize = 16,
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
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <ActionButton {...props}>
      <MintIcon className={cn("stroke-primary")} />
    </ActionButton>
  );
};

function ActionMenuItem({
  index,
  children,
}: {
  children: React.ReactNode;
  index: number;
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

  const translateStyle = useMemo(() => {
    switch (direction) {
      case "top":
        return {
          translateY: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(52 * index)],
          }),
        };
      case "left":
        return {
          translateX: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(52 * index)],
          }),
        };
      default:
        return {
          translateY: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(52 * index)],
          }),
        };
    }
  }, [translateYAnimatedValue, direction]);
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
      translateStyle,
    ],
  };
  return <Animated.View style={[actionStyle]}>{children}</Animated.View>;
}

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
  const {
    openExploreCastMenu: showActions,
    setOpenExploreCastMenu: showActionsChange,
  } = useAppSettings();
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
        <GiftButton className=" shadow-md shadow-primary" onPress={onGift} />
      </ActionMenuItem> */}
        <ActionMenuItem index={5}>
          <Link
            href={`/create${channelId ? "?channelId=" + channelId : ""}`}
            asChild
          >
            <ActionButton className="shadow-md shadow-primary">
              <SquarePen size={16} strokeWidth={2} className="stroke-primary" />
            </ActionButton>
          </Link>
        </ActionMenuItem>

        <ActionMenuItem index={4}>
          <CommentButton
            className=" shadow-md shadow-primary"
            onPress={onComment}
          />
        </ActionMenuItem>
        <ActionMenuItem index={3}>
          <MintButton className=" shadow-md shadow-primary" onPress={onMint} />
        </ActionMenuItem>
        <ActionMenuItem index={2}>
          {/* <ShareButton className=" shadow-md shadow-primary" onPress={onShare} /> */}
          <RepostButton
            className=" shadow-md shadow-primary"
            disabled={reposting}
            reposted={reposted}
            reposting={reposting}
            onPress={onRepost}
          />
        </ActionMenuItem>
        <ActionMenuItem index={1}>
          <LikeButton
            className=" shadow-md shadow-primary"
            disabled={liking}
            liked={liked}
            liking={liking}
            likeCount={likeCount}
            onPress={onLike}
          />
        </ActionMenuItem>
      </ActionMenuCtx.Provider>
      <ActionButton
        className=" z-10 h-[50px] w-[50px] shadow-md shadow-primary"
        onPress={toggleActions}
      >
        <Animated.View
          style={[
            {
              transform: [
                {
                  rotate: toggleBtnAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("~/assets/images/degen-icon.png")}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </Animated.View>
      </ActionButton>
      {/* <Link
        href={`/create${channelId ? "?channelId=" + channelId : ""}`}
        asChild
      >
        <ActionButton className="z-10 mt-3 h-[50px] w-[50px] shadow-md shadow-primary">
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
