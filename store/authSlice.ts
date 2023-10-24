import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/userTypes";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  } as {
    token: null | string;
    userData: null | User;
    didTryAutoLogin: boolean;
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
    },

    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },

    logout: (state) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },

    updateUserDataRedux: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData };
    },
  },
});

export const { authenticate, setDidTryAutoLogin, logout, updateUserDataRedux } =
  authSlice.actions;
export default authSlice.reducer;
