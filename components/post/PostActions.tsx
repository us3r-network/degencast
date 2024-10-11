import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { DollarSign, Heart, Repeat, Share2 } from "../common/Icons";
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
import { CommentIcon2, DegenIcon, MintIcon } from "../common/SvgIcons";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import React from "react";

export const ActionButton = forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      className={cn(
        " h-[32px] w-[32px] flex-col rounded-full bg-[#9151C3] p-0 active:bg-[#9151C3] active:opacity-100 web:hover:opacity-100",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export function ActionText({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn("text-xs leading-none text-white", className)}
      {...props}
    />
  );
}

export function PostActionMenuItem({
  index,
  children,
  size = 32,
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
  } = usePostActionMenuCtx();

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

  const [hideChildren, setHideChildren] = useState(false);
  useEffect(() => {
    if (!showMenu) {
      setTimeout(() => {
        setHideChildren(true);
      }, 200 * index);
    } else {
      setHideChildren(false);
    }
  }, [showMenu, index]);

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
      case "right":
        return {
          translateX: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, offset * index],
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
    width: 32,
    height: 32,
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
  return (
    <Animated.View style={[actionStyle]}>
      {!showMenu && hideChildren ? null : children}
    </Animated.View>
  );
}

const PostActionMenuItemButton = forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <ActionButton
      ref={ref}
      className={cn(" h-[32px] w-[32px]", className)}
      {...props}
    />
  );
});

export const LikeButton = ({
  liked,
  liking,
  likeCount,
  className,
  iconSize = 12,
  ...props
}: ButtonProps & {
  liked: boolean;
  liking?: boolean;
  likeCount?: number;
  iconSize?: number;
}) => {
  return (
    <PostActionMenuItemButton
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
    </PostActionMenuItemButton>
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
    <PostActionMenuItemButton {...props}>
      {reposting ? (
        <ActivityIndicator
          size={iconSize}
          color={reposted ? "#00D1A7" : "white"}
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
    </PostActionMenuItemButton>
  );
};

export const GiftButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <PostActionMenuItemButton {...props}>
      <DollarSign size={iconSize} className={cn("stroke-primary-foreground")} />
      {/* <ActionText>{giftCount || 0}</ActionText> */}
    </PostActionMenuItemButton>
  );
};

export const CommentButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <PostActionMenuItemButton {...props}>
      <CommentIcon2
        width={iconSize}
        height={iconSize}
        className={cn(
          " flex fill-primary-foreground stroke-primary-foreground",
        )}
      />
    </PostActionMenuItemButton>
  );
};

export const ShareButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <PostActionMenuItemButton {...props}>
      <Share2
        size={iconSize}
        className={cn(" fill-primary-foreground stroke-primary-foreground")}
      />
    </PostActionMenuItemButton>
  );
};

export const MintButton = ({
  iconSize = 16,
  ...props
}: ButtonProps & {
  iconSize?: number;
}) => {
  return (
    <PostActionMenuItemButton {...props}>
      <MintIcon className={cn("stroke-primary-foreground")} />
    </PostActionMenuItemButton>
  );
};

type PostActionMenuButtonProps = {
  direction?: "top" | "left" | "right";
};
const PostActionMenuCtx = React.createContext<{
  showMenu?: boolean;
  direction?: "top" | "left" | "right";
  scaleAnimatedValue: Animated.Value;
  translateYAnimatedValue: Animated.Value;
  translateXAnimatedValue: Animated.Value;
}>({
  showMenu: false,
  direction: "right",
  scaleAnimatedValue: new Animated.Value(0),
  translateYAnimatedValue: new Animated.Value(0),
  translateXAnimatedValue: new Animated.Value(0),
});
function usePostActionMenuCtx() {
  const context = useContext(PostActionMenuCtx);
  if (!context) {
    throw new Error(
      "usePostActionMenuCtx must be used within PostActionMenuCtx",
    );
  }
  return context;
}
export function PostActionMenu({
  direction = "right",
  className,
  children,
}: ViewProps & PostActionMenuButtonProps) {
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
      case "right":
        return "-90deg";
      case "left":
        return "90deg";
      case "top":
        return "180deg";
      default:
        return "-90deg";
    }
  }, [direction]);
  return (
    <View
      className={cn(
        " relative flex w-fit flex-col items-center",
        direction === "left" ? " h-fit flex-row" : "",
        className,
      )}
    >
      <PostActionMenuCtx.Provider
        value={{
          showMenu: showActions,
          direction,
          scaleAnimatedValue,
          translateYAnimatedValue,
          translateXAnimatedValue,
        }}
      >
        {children}
      </PostActionMenuCtx.Provider>
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
          <DegenIcon />
        </Animated.View>
      </ActionButton>
    </View>
  );
}
