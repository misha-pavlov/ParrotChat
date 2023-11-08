import { createSlice } from "@reduxjs/toolkit";
import { Chat } from "../types/chatTypes";

type ChatsData = { [x: string]: Chat };

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chatsData: {},
  } as {
    chatsData: ChatsData;
  },
  reducers: {
    setChatData: (state, action) => {
      const { payload } = action;
      state.chatsData = { ...payload.chatsData };
    },
  },
});

export const { setChatData } = chatSlice.actions;
export default chatSlice.reducer;
