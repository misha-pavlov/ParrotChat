import { HStack, Image, Pressable, Text, View } from "native-base";
import { FC, useCallback, useMemo, useRef } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import * as Clipboard from "expo-clipboard";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { colors } from "../config/colors";
import { starMessage } from "../utils/actions/chatActions";
import { RootState } from "../store/store";
import { formatAmPm } from "../helpers/dateHelpers";
import { Message } from "../types/messageTypes";
import { getUserName } from "../helpers/userHelpers";

type MessageItemPropsType = {
  text: string;
  type: "myMessage" | "theirMessage" | "reply";
  setReply?: VoidFunction;
  replyingTo?: Message;
  name?: string;
  messageId?: string;
  userId?: string;
  chatId?: string;
  date?: string;
  imageUrl?: string;
};

type MenuItemParams = {
  text: string;
  icon: string;
  IconPack?: any;
  onSelect: VoidFunction;
};

const MessageItem: FC<MessageItemPropsType> = ({
  text,
  type,
  messageId,
  chatId,
  userId,
  date,
  setReply,
  replyingTo,
  name,
  imageUrl,
}) => {
  const menuRef = useRef<Menu>(null);
  const starredMessages = useSelector((state: RootState) =>
    chatId ? state.messages.starredMessages[chatId] : {}
  );
  const storedUsers = useSelector(
    (state: RootState) => state.users.storedUsers
  );

  const isMyMessage = type === "myMessage";
  const isReply = type === "reply";
  const isStarred = messageId && starredMessages
    ? starredMessages[messageId] !== undefined
    : false;
  const replyingToUser = replyingTo && storedUsers[replyingTo.sendBy];

  const copyToClipboard = useCallback(
    async (text: string) => Clipboard.setStringAsync(text),
    []
  );

  const renderMenuItem = useCallback(
    ({ text, onSelect, IconPack = Feather, icon }: MenuItemParams) => (
      <MenuOption onSelect={onSelect}>
        <HStack alignItems="center" p={1}>
          <Text
            flex={1}
            fontFamily="Quicksand-Regular"
            letterSpacing={0.3}
            fontSize={16}
          >
            {text}
          </Text>
          <IconPack name={icon} size={18} />
        </HStack>
      </MenuOption>
    ),
    []
  );

  const backgroundColor = useMemo(() => {
    if (isMyMessage) {
      return colors.lightGreen;
    }

    if (isReply) {
      return colors.grey1;
    }

    return colors.nearlyWhite;
  }, [isMyMessage, isReply]);

  return (
    <Pressable
      backgroundColor={backgroundColor}
      borderRadius={5}
      alignSelf={isMyMessage ? "flex-end" : "flex-start"}
      p={1}
      _pressed={{ opacity: 0.5 }}
      onLongPress={() => menuRef.current?.open()}
      {...(isReply && { w: "100%" })}
    >
      {name && (
        <Text letterSpacing={0.3} fontWeight={600}>
          {name}
        </Text>
      )}

      {replyingToUser && (
        <View mb={imageUrl ? 2 : 0}>
          <MessageItem
            type="reply"
            text={replyingTo?.text}
            name={getUserName(replyingToUser)}
          />
        </View>
      )}

      {!imageUrl && <Text>{text}</Text>}

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          w={300}
          h={300}
          mb={1}
          alt="Attached image"
        />
      )}

      {date && (
        <HStack alignSelf="flex-end" alignItems="center" space={1}>
          {isStarred && (
            <FontAwesome name="star" size={14} color={colors.grey} />
          )}
          <Text
            fontFamily="Quicksand-Regular"
            letterSpacing={0.3}
            color={colors.grey}
            fontSize={12}
          >
            {formatAmPm(new Date(date))}
          </Text>
        </HStack>
      )}

      <Menu ref={menuRef}>
        <MenuTrigger />
        <MenuOptions>
          {renderMenuItem({
            text: "Copy to clipboard",
            onSelect: () => copyToClipboard(text),
            icon: "copy",
          })}
          {renderMenuItem({
            text: `${isStarred ? "Unstar" : "Star"} message`,
            onSelect: () =>
              messageId &&
              chatId &&
              userId &&
              starMessage(messageId, chatId, userId),
            icon: isStarred ? "star-o" : "star",
            IconPack: FontAwesome,
          })}
          {setReply &&
            renderMenuItem({
              text: "Reply",
              onSelect: setReply,
              icon: "arrow-left-circle",
            })}
        </MenuOptions>
      </Menu>
    </Pressable>
  );
};

export default MessageItem;
