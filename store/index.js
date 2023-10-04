import { configureStore } from "@reduxjs/toolkit";
import login from "@/store/login";
import user from '@/store/user'

// Creating our store and combining all slices
export const store = configureStore({
  reducer: {
        login,
      user
  },
  devTools: true,
});