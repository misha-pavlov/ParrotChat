import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/userTypes";

type StoredUsers = { [x: string]: User };

const userSlice = createSlice({
  name: "users",
  initialState: {
    storedUsers: {},
  } as {
    storedUsers: StoredUsers;
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const { payload } = action;
      const newUsers = payload.users;
      const oldUsers = state.storedUsers;
      const usersArray = Object.values(newUsers);

      for (let i = 0; i < usersArray.length; i++) {
        const userData = usersArray[i] as User;
        oldUsers[userData.userId] = userData;
      }

      state.storedUsers = oldUsers;
    },
  },
});

export const { setStoredUsers } = userSlice.actions;
export default userSlice.reducer;
