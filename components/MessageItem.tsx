import { HStack, Pressable, Text } from "native-base";
import { FC, useCallback, useRef } from "react";
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

type MessageItemPropsType = {
  text: string;
  messageId: string;
  userId: string;
  chatId: string;
  type: "myMessage" | "theirMessage";
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
}) => {
  const isMyMessage = type === "myMessage";
  const menuRef = useRef<Menu>(null);
  const starredMessages = useSelector(
    (state: RootState) => state.messages.starredMessages[chatId] ?? {}
  );
  const isStarred = starredMessages[messageId] !== undefined;

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

  return (
    <Pressable
      backgroundColor={isMyMessage ? colors.lightGreen : colors.nearlyWhite}
      borderRadius={5}
      alignSelf={isMyMessage ? "flex-end" : "flex-start"}
      p={1}
      maxW="90%"
      _pressed={{ opacity: 0.5 }}
      onLongPress={() => menuRef.current?.open()}
    >
      <Text>{text}</Text>

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
            onSelect: () => starMessage(messageId, chatId, userId),
            icon: isStarred ? "star-o" : "star",
            IconPack: FontAwesome,
          })}
        </MenuOptions>
      </Menu>
    </Pressable>
  );
};

export default MessageItem;
