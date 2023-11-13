import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../types/messageTypes";

type MessagesData = { [x: string]: { [y: string]: Message } };

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        messagesData: {},
    } as {
        messagesData: MessagesData;
    },
    reducers: {
        setChatMessages: (state, action) => {
            const existingMessages = state.messagesData;
            const { chatId, messagesData } = action.payload;
            existingMessages[chatId] = messagesData;
            state.messagesData = existingMessages;
        },
    },
});

export const { setChatMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
