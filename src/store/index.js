import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./slices/campaignSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    campaigns: campaignReducer,
    users: userReducer,
  },
});

export default store;
