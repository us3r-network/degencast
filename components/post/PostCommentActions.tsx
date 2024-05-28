import { cn } from "~/lib/utils";
import { Heart, Repeat } from "../common/Icons";
import { Text } from "../ui/text";
import {
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";
import { CommentIcon } from "../common/SvgIcons";

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
  iconSize = 16,
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
  iconSize = 16,
  commentCount = 0,
  ...props
}: ActionButtonProps & {
  iconSize?: number;
  commentCount: number;
}) => {
  return (
    <ActionButton {...props}>
      <CommentIcon
        width={iconSize}
        height={iconSize}
        className={cn(" stroke-secondary")}
      />
      <ActionText className={cn(" text-secondary")}>
        {commentCount || 0}
      </ActionText>
    </ActionButton>
  );
};

export const RepostButton = ({
  iconSize = 16,
  repostCount = 0,
  reposted,
  ...props
}: ActionButtonProps & {
  iconSize?: number;
  repostCount: number;
  reposted?: boolean;
}) => {
  return (
    <ActionButton {...props}>
      <Repeat
        size={iconSize}
        className={cn(" stroke-secondary", reposted && " stroke-[#00D1A7] ")}
      />
      <ActionText
        className={cn(" text-secondary", reposted && " text-[#00D1A7]")}
      >
        {repostCount || 0}
      </ActionText>
    </ActionButton>
  );
};

export const PostCommentActions = ({
  liked,
  likeCount,
  commentCount,
  repostCount,
  onLike,
  onComment,
  onRepost,
  reposted,
  className,
  ...props
}: ViewProps & {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  reposted: boolean;
  onLike: () => void;
  onComment: () => void;
  onRepost: () => void;
}) => {
  return (
    <View
      className={cn(" flex w-fit flex-row items-center gap-3", className)}
      {...props}
    >
      <CommentButton onPress={onComment} commentCount={commentCount} />
      <RepostButton
        onPress={onRepost}
        repostCount={repostCount}
        reposted={reposted}
      />
      <LikeButton liked={liked} likeCount={likeCount} onPress={onLike} />
    </View>
  );
};
