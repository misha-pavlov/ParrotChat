import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
    },

    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
  },
});

export const { authenticate, setDidTryAutoLogin } = authSlice.actions;
export default authSlice.reducer;
