import { createSlice } from "@reduxjs/toolkit";
import { Message, StarredMessages } from "../types/messageTypes";

type MessagesData = { [x: string]: { [y: string]: Message } };
type StarredMessagesData = { [x: string]: { [y: string]: StarredMessages } };

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        messagesData: {},
        starredMessages: {},
    } as {
        messagesData: MessagesData;
        starredMessages: StarredMessagesData;
    },
    reducers: {
        setChatMessages: (state, action) => {
            const existingMessages = state.messagesData;
            const { chatId, messagesData } = action.payload;
            existingMessages[chatId] = messagesData;
            state.messagesData = existingMessages;
        },
        addStarredMessage: (state, action) => {
            const { starredMessageData } = action.payload;
            state.starredMessages[starredMessageData.messageId] = starredMessageData;
        },
        removeStarredMessage: (state, action) => {
            const { messageId } = action.payload;
            delete state.starredMessages[messageId];
        },
        setStarredMessages: (state, action) => {
            const { starredMessages } = action.payload;
            state.starredMessages = { ...starredMessages };
        }
    },
});

export const { setChatMessages, addStarredMessage, removeStarredMessage, setStarredMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
